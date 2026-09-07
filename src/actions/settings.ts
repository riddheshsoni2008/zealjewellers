"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { rateSchema, RateInput } from "@/lib/validators/rate";
import { ActionResult } from "@/actions/auth";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { getTenantId } from "@/lib/tenant";

export interface RateSettingsData {
  _id: string;
  goldRate22k: number;
  goldRate18k: number;
  silverRate: number;
  shopName: string;
  updatedAt: string;
  updatedBy?: { name: string; email: string };
}

// In-Memory Caching per Tenant to eliminate DB latency
const cachedRateDataMap = new Map<string, { data: RateSettingsData; time: number }>();
const CACHE_TTL_MS = 300000; // 5 minutes

export async function getRateSettings(): Promise<ActionResult<RateSettingsData>> {
  try {
    const session = await auth();
    const tenantId = await getTenantId();
    if (!tenantId) {
      return { success: false, error: "Unauthorized access" };
    }

    const tenantKey = tenantId.toString();
    const now = Date.now();
    const cached = cachedRateDataMap.get(tenantKey);
    if (cached && now - cached.time < CACHE_TTL_MS) {
      return { success: true, data: cached.data };
    }

    await connectDB();

    let user = await User.findById(tenantId)
      .select("goldRate22k goldRate18k silverRate shopName name email updatedAt")
      .lean();

    if (!user) {
      user = await User.findOne({ role: "admin" })
        .sort({ createdAt: 1 })
        .select("goldRate22k goldRate18k silverRate shopName name email updatedAt")
        .lean();
    }
    if (!user && session?.user?.id) {
      user = await User.findById(session.user.id)
        .select("goldRate22k goldRate18k silverRate shopName name email updatedAt")
        .lean();
    }

    const formatted: RateSettingsData = {
      _id: tenantId.toString(),
      goldRate22k: user?.goldRate22k ?? 7200,
      goldRate18k: user?.goldRate18k ?? 5900,
      silverRate: user?.silverRate ?? 85,
      shopName: user?.shopName || "Zeal Jewellers",
      updatedAt: user && (user as any).updatedAt
        ? new Date((user as any).updatedAt).toISOString()
        : new Date().toISOString(),
      updatedBy: user ? { name: user.name, email: user.email } : { name: "Zeal Jewellers", email: "" },
    };

    cachedRateDataMap.set(tenantKey, { data: formatted, time: now });

    return { success: true, data: formatted };
  } catch (error: any) {
    console.error("Error fetching rate settings:", error?.message || error);
    return { success: false, error: `Failed to fetch rate settings: ${error?.message || "Unknown error"}` };
  }
}

export async function updateRateSettings(
  input: RateInput
): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    const tenantId = await getTenantId();
    if (!session?.user?.id || !tenantId) {
      return { success: false, error: "Unauthorized access" };
    }

    const validated = rateSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid rate values",
      };
    }

    await connectDB();

    const updateData: Record<string, any> = {
      goldRate22k: validated.data.goldRate22k,
      goldRate18k: validated.data.goldRate18k,
      silverRate: validated.data.silverRate,
      shopName: validated.data.shopName,
    };

    if (validated.data.ownerName && validated.data.ownerName.trim()) {
      updateData.name = validated.data.ownerName.trim();
    }

    // Update rate fields directly on the User model document (no separate rates collection)
    await User.findByIdAndUpdate(tenantId, updateData);

    // Invalidate memory cache for this tenant
    cachedRateDataMap.delete(tenantId.toString());

    revalidatePath("/", "layout");
    revalidatePath("/settings");
    revalidatePath("/sales/new");
    revalidatePath("/sales");
    revalidatePath("/dashboard");

    return { success: true, data: "Rate settings updated successfully" };
  } catch (error) {
    console.error("Error updating rate settings:", error);
    return { success: false, error: "Failed to update rate settings" };
  }
}

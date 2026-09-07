import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import mongoose from "mongoose";

// In-memory cache for staff -> ownerId mapping to avoid repeated DB lookups
const staffTenantCache = new Map<string, { tenantId: mongoose.Types.ObjectId; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function getTenantId(): Promise<mongoose.Types.ObjectId | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRole = (session.user as any)?.role;
  const userObjId = new mongoose.Types.ObjectId(session.user.id);

  // Fast-path: Admin is their own tenant, zero DB query needed
  if (userRole === "admin") {
    return userObjId;
  }

  // Check in-memory cache for staff
  const cached = staffTenantCache.get(session.user.id);
  if (cached && Date.now() < cached.expiry) {
    return cached.tenantId;
  }

  await connectDB();

  const user = await User.findById(userObjId).select("ownerId role").lean();

  if (user && user.role === "staff") {
    if (user.ownerId) {
      const ownerExists = await User.exists({ _id: user.ownerId });
      if (ownerExists) {
        const tId = user.ownerId as mongoose.Types.ObjectId;
        staffTenantCache.set(session.user.id, { tenantId: tId, expiry: Date.now() + CACHE_TTL_MS });
        return tId;
      }
    }
    // Fallback: If staff has no ownerId or owner was removed, use shop's primary Admin ID
    const firstAdmin = await User.findOne({ role: "admin" })
      .sort({ createdAt: 1 })
      .select("_id")
      .lean();
    if (firstAdmin) {
      const tId = firstAdmin._id as mongoose.Types.ObjectId;
      staffTenantCache.set(session.user.id, { tenantId: tId, expiry: Date.now() + CACHE_TTL_MS });
      return tId;
    }
  }

  return userObjId;
}


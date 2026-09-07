"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  ShoppingCart,
  Receipt,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    role?: "admin" | "staff";
  };
  shopName?: string;
}

export function MobileNav({ isOpen, onClose, user, shopName }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) return null;

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "staff"] },
    { title: "Inventory Stock", href: "/stock", icon: Gem, roles: ["admin", "staff"] },
    { title: "New Sale Bill", href: "/sales/new", icon: ShoppingCart, roles: ["admin", "staff"] },
    { title: "Sales History", href: "/sales", icon: Receipt, roles: ["admin", "staff"] },
    { title: "Expenses", href: "/expenses", icon: DollarSign, roles: ["admin", "staff"] },
    { title: "Reports & Analytics", href: "/reports", icon: BarChart3, roles: ["admin", "staff"] },
    { title: "Shop Settings", href: "/settings", icon: Settings, roles: ["admin", "staff"] },
  ];

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(user.role || "staff")
  );

  const handleLogout = async () => {
    onClose();
    const res = await logoutUser();
    if (res.success) {
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex w-4/5 max-w-xs flex-col bg-white dark:bg-slate-950 p-6 shadow-2xl border-r border-amber-200 dark:border-slate-800 transition-colors duration-200">
        <div className="flex items-center justify-between pb-6 border-b border-amber-100 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src="/logo.png"
              alt="Zeal Jewellers Logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            <span className="font-serif font-bold text-sm text-amber-800 dark:text-amber-400 truncate">
              {shopName || "Zeal Jewellers"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 py-6 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/stock" && pathname.startsWith("/stock/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-900 hover:text-amber-900 dark:hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 pt-4 border-t border-amber-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>Interface Theme:</span>
            <ThemeToggle showLabel />
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

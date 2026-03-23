"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Grid3X3,
  FileText,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Vendors", icon: Building2 },
  { href: "/risk-heatmap", label: "Risk Heatmap", icon: Grid3X3 },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/alerts", label: "Alerts", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          VendorLens
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              JS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              John Smith
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Risk Manager
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoading ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </aside>
  );
}

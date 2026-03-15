"use client";

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/app-layout";
import { RiskBadge } from "@/components/risk-badge";
import { Skeleton } from "@/components/skeletons";
import { alerts as initialAlerts, type Alert, type AlertType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FileWarning,
  Clock,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  Eye,
  X,
  Bell,
  AlertTriangle,
} from "lucide-react";

const alertTypeIcons: Record<AlertType, React.ElementType> = {
  "Document Expiry": FileWarning,
  "Overdue Review": Clock,
  "Risk Score Change": TrendingUp,
  "New Vendor Pending": UserPlus,
};

const alertTypeColors: Record<AlertType, string> = {
  "Document Expiry": "text-risk-high",
  "Overdue Review": "text-risk-critical",
  "Risk Score Change": "text-risk-medium",
  "New Vendor Pending": "text-primary",
};

export default function AlertsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [showResolved, setShowResolved] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AlertType | "all">("all");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((alert) => {
        const matchesResolved = showResolved || !alert.resolved;
        const matchesType = activeFilter === "all" || alert.type === activeFilter;
        return matchesResolved && matchesType;
      })
      .sort((a, b) => {
        // Sort by resolved status first (unresolved first), then by severity
        if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
        const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }, [alerts, showResolved, activeFilter]);

  const handleMarkResolved = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    }
    return `Due ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  };

  // Stats
  const stats = {
    total: alerts.filter((a) => !a.resolved).length,
    critical: alerts.filter((a) => !a.resolved && a.severity === "Critical")
      .length,
    high: alerts.filter((a) => !a.resolved && a.severity === "High").length,
    documentExpiry: alerts.filter(
      (a) => !a.resolved && a.type === "Document Expiry"
    ).length,
    overdueReview: alerts.filter(
      (a) => !a.resolved && a.type === "Overdue Review"
    ).length,
  };

  const alertTypes: AlertType[] = [
    "Document Expiry",
    "Overdue Review",
    "Risk Score Change",
    "New Vendor Pending",
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Alerts & Reminders
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage vendor-related alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="show-resolved"
              checked={showResolved}
              onCheckedChange={setShowResolved}
            />
            <Label htmlFor="show-resolved" className="text-sm">
              Show Resolved
            </Label>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Open Alerts</span>
            </div>
            <p className="text-2xl font-semibold text-foreground mt-2">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-risk-critical" />
              <span className="text-xs text-muted-foreground">Critical</span>
            </div>
            <p className="text-2xl font-semibold text-risk-critical mt-2">
              {stats.critical}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-risk-high" />
              <span className="text-xs text-muted-foreground">
                Document Expiry
              </span>
            </div>
            <p className="text-2xl font-semibold text-risk-high mt-2">
              {stats.documentExpiry}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-risk-critical" />
              <span className="text-xs text-muted-foreground">
                Overdue Reviews
              </span>
            </div>
            <p className="text-2xl font-semibold text-risk-critical mt-2">
              {stats.overdueReview}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All Alerts
          </Button>
          {alertTypes.map((type) => {
            const Icon = alertTypeIcons[type];
            const count = alerts.filter(
              (a) => !a.resolved && a.type === type
            ).length;
            return (
              <Button
                key={type}
                variant={activeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {type}
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Alerts List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full max-w-md" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const Icon = alertTypeIcons[alert.type];
              const colorClass = alertTypeColors[alert.type];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "rounded-xl border bg-card p-4 transition-opacity",
                    alert.resolved
                      ? "border-border/50 opacity-60"
                      : "border-border",
                    !alert.resolved &&
                      alert.severity === "Critical" &&
                      "border-risk-critical/50 bg-risk-critical/5",
                    !alert.resolved &&
                      alert.severity === "High" &&
                      "border-risk-high/50 bg-risk-high/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                        alert.resolved
                          ? "bg-muted text-muted-foreground"
                          : `bg-muted ${colorClass}`
                      )}
                    >
                      {alert.resolved ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {alert.vendorName}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {alert.type}
                        </span>
                        <RiskBadge level={alert.severity} />
                        {alert.resolved && (
                          <span className="inline-flex items-center rounded-full bg-risk-low/20 px-2 py-0.5 text-xs font-medium text-risk-low">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-2",
                          !alert.resolved &&
                            new Date(alert.dueDate) < new Date()
                            ? "text-risk-critical font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(alert.dueDate)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!alert.resolved && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkResolved(alert.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Link href="/vendors">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-risk-low/20">
                <CheckCircle2 className="h-6 w-6 text-risk-low" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground">
              All caught up!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              No alerts match your current filters.
            </p>
          </div>
        )}

        {/* Summary */}
        {!isLoading && filteredAlerts.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} alert
              {filteredAlerts.length !== 1 ? "s" : ""}
              {activeFilter !== "all" && ` for ${activeFilter}`}
              {showResolved
                ? " (including resolved)"
                : " (hiding resolved)"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

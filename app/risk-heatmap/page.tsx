"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { VendorProfileSheet } from "@/components/vendor-profile-sheet";
import { vendors, type Vendor } from "@/lib/mock-data";
import { Skeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiskBadge } from "@/components/risk-badge";

// Heatmap cell color based on risk coordinates
function getCellColor(likelihood: number, impact: number): string {
  const score = likelihood * impact;
  if (score >= 20) return "bg-risk-critical/80 hover:bg-risk-critical";
  if (score >= 12) return "bg-risk-high/80 hover:bg-risk-high";
  if (score >= 6) return "bg-risk-medium/80 hover:bg-risk-medium";
  return "bg-risk-low/80 hover:bg-risk-low";
}

function getCellColorClass(likelihood: number, impact: number): string {
  const score = likelihood * impact;
  if (score >= 20) return "Critical";
  if (score >= 12) return "High";
  if (score >= 6) return "Medium";
  return "Low";
}

export default function RiskHeatmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter out offboarded vendors
  const activeVendors = vendors.filter((v) => v.status !== "Offboarded");

  // Group vendors by their heatmap coordinates
  const vendorsByCell: Record<string, Vendor[]> = {};
  activeVendors.forEach((vendor) => {
    const key = `${vendor.likelihood}-${vendor.impact}`;
    if (!vendorsByCell[key]) {
      vendorsByCell[key] = [];
    }
    vendorsByCell[key].push(vendor);
  });

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsProfileOpen(true);
  };

  const likelihoodLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
  const impactLabels = ["Insignificant", "Minor", "Moderate", "Major", "Severe"];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Risk Heatmap
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visual representation of vendor risks based on likelihood and impact
          </p>
        </div>

        {/* Heatmap Container */}
        <div className="rounded-xl border border-border bg-card p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-[500px] w-full" />
            </div>
          ) : (
            <TooltipProvider delayDuration={0}>
              <div className="flex">
                {/* Y-axis label */}
                <div className="flex items-center mr-2">
                  <span className="text-xs font-medium text-muted-foreground -rotate-90 whitespace-nowrap">
                    IMPACT
                  </span>
                </div>

                {/* Y-axis labels */}
                <div className="flex flex-col justify-between py-2 pr-3">
                  {[...impactLabels].reverse().map((label, i) => (
                    <div
                      key={label}
                      className="h-24 flex items-center justify-end"
                    >
                      <span className="text-xs text-muted-foreground text-right w-20">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-5 gap-1">
                    {/* Render cells from top-left (1,5) to bottom-right (5,1) */}
                    {[5, 4, 3, 2, 1].map((impact) =>
                      [1, 2, 3, 4, 5].map((likelihood) => {
                        const key = `${likelihood}-${impact}`;
                        const vendorsInCell = vendorsByCell[key] || [];
                        const riskLevel = getCellColorClass(likelihood, impact);

                        return (
                          <div
                            key={key}
                            className={cn(
                              "h-24 rounded-lg p-2 transition-colors",
                              getCellColor(likelihood, impact)
                            )}
                          >
                            <div className="flex flex-wrap gap-1 h-full overflow-hidden">
                              {vendorsInCell.map((vendor) => (
                                <Tooltip key={vendor.id}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleVendorClick(vendor)}
                                      className="inline-flex items-center px-2 py-1 rounded-md bg-background/90 hover:bg-background text-xs font-medium text-foreground truncate max-w-full transition-colors shadow-sm"
                                    >
                                      {vendor.name.length > 12
                                        ? vendor.name.substring(0, 12) + "..."
                                        : vendor.name}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="w-64 p-0"
                                  >
                                    <div className="p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">
                                          {vendor.name}
                                        </span>
                                        <RiskBadge level={vendor.inherentRisk} />
                                      </div>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Category:
                                          </span>
                                          <span>{vendor.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Risk Score:
                                          </span>
                                          <span>{vendor.residualRiskScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Likelihood:
                                          </span>
                                          <span>
                                            {likelihoodLabels[vendor.likelihood - 1]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Impact:
                                          </span>
                                          <span>
                                            {impactLabels[vendor.impact - 1]}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                                        Click to view full profile
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* X-axis labels */}
                  <div className="grid grid-cols-5 gap-1 mt-2">
                    {likelihoodLabels.map((label) => (
                      <div key={label} className="text-center">
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* X-axis title */}
                  <div className="text-center mt-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      LIKELIHOOD
                    </span>
                  </div>
                </div>
              </div>
            </TooltipProvider>
          )}
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Risk Level Legend
          </h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-low" />
              <div>
                <p className="text-sm font-medium text-foreground">Low Risk</p>
                <p className="text-xs text-muted-foreground">Score 1-5</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-medium" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Medium Risk
                </p>
                <p className="text-xs text-muted-foreground">Score 6-11</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-high" />
              <div>
                <p className="text-sm font-medium text-foreground">High Risk</p>
                <p className="text-xs text-muted-foreground">Score 12-19</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-critical" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Critical Risk
                </p>
                <p className="text-xs text-muted-foreground">Score 20-25</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Risk Score Calculation:</strong> Likelihood (1-5) ×
              Impact (1-5) = Risk Score (1-25). Vendors are placed on the
              heatmap based on their assessed likelihood and impact values.
              Click any vendor chip to view their detailed risk profile.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Critical Zone</p>
            <p className="text-2xl font-semibold text-risk-critical mt-1">
              {
                activeVendors.filter(
                  (v) => v.likelihood * v.impact >= 20
                ).length
              }
            </p>
            <p className="text-xs text-muted-foreground">vendors</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">High Risk Zone</p>
            <p className="text-2xl font-semibold text-risk-high mt-1">
              {
                activeVendors.filter(
                  (v) =>
                    v.likelihood * v.impact >= 12 &&
                    v.likelihood * v.impact < 20
                ).length
              }
            </p>
            <p className="text-xs text-muted-foreground">vendors</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Medium Risk Zone</p>
            <p className="text-2xl font-semibold text-risk-medium mt-1">
              {
                activeVendors.filter(
                  (v) =>
                    v.likelihood * v.impact >= 6 &&
                    v.likelihood * v.impact < 12
                ).length
              }
            </p>
            <p className="text-xs text-muted-foreground">vendors</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Low Risk Zone</p>
            <p className="text-2xl font-semibold text-risk-low mt-1">
              {
                activeVendors.filter((v) => v.likelihood * v.impact < 6)
                  .length
              }
            </p>
            <p className="text-xs text-muted-foreground">vendors</p>
          </div>
        </div>
      </div>

      {/* Vendor Profile Sheet */}
      <VendorProfileSheet
        vendor={selectedVendor}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </AppLayout>
  );
}

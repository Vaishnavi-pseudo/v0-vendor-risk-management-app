"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { RiskBadge, StatusBadge, DocumentStatusBadge } from "@/components/risk-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Vendor } from "@/lib/mock-data";
import { documents } from "@/lib/mock-data";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  User,
  MapPin,
  Shield,
  FileText,
  Calendar,
  CircleDot,
} from "lucide-react";

interface VendorProfileSheetProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorProfileSheet({
  vendor,
  open,
  onOpenChange,
}: VendorProfileSheetProps) {
  if (!vendor) return null;

  const vendorDocuments = documents.filter((d) => d.vendorId === vendor.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-start justify-between pr-8">
            <div>
              <SheetTitle className="text-xl">{vendor.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <span>{vendor.category}</span>
                <span className="text-muted-foreground">·</span>
                <StatusBadge status={vendor.status} />
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Risk Overview */}
            <section>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Risk Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Inherent Risk</p>
                  <div className="mt-2">
                    <RiskBadge level={vendor.inherentRisk} />
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    Residual Risk Score
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          vendor.residualRiskScore >= 70
                            ? "bg-risk-critical"
                            : vendor.residualRiskScore >= 50
                            ? "bg-risk-high"
                            : vendor.residualRiskScore >= 30
                            ? "bg-risk-medium"
                            : "bg-risk-low"
                        }`}
                        style={{ width: `${vendor.residualRiskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {vendor.residualRiskScore}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Data Access</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {vendor.dataAccess}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    Financial Exposure
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {vendor.financialExposure}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Operational Dependency
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {vendor.operationalDependency}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Company Details */}
            <section>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Company Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{vendor.country}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {vendor.website}
                  </a>
                </div>
              </div>
            </section>

            <Separator />

            {/* Contact Information */}
            <section>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{vendor.contactName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={`mailto:${vendor.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {vendor.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{vendor.contactPhone}</span>
                </div>
              </div>
            </section>

            <Separator />

            {/* Documents */}
            <section>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Linked Documents
              </h3>
              {vendorDocuments.length > 0 ? (
                <div className="space-y-2">
                  {vendorDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {doc.type}
                        </p>
                        {doc.expiryDate && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <DocumentStatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No documents linked to this vendor.
                </p>
              )}
            </section>

            <Separator />

            {/* Review History */}
            <section>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Review History
              </h3>
              <div className="space-y-1">
                {vendor.reviewHistory.map((event, index) => (
                  <div key={index} className="flex gap-3 py-2">
                    <div className="flex flex-col items-center">
                      <CircleDot className="h-4 w-4 text-primary shrink-0" />
                      {index < vendor.reviewHistory.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm text-foreground">{event.event}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(event.date).toLocaleDateString()} · {event.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Assigned Reviewer */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Assigned Reviewer</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {vendor.assignedReviewer}
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

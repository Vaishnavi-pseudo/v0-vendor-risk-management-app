"use client";

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/app-layout";
import { DocumentStatusBadge } from "@/components/risk-badge";
import { TableSkeleton } from "@/components/skeletons";
import {
  documents,
  vendors,
  type VendorDocument,
  type DocumentStatus,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const documentTypes = [
  "NDA",
  "SOC 2 Report",
  "Information Security Policy",
  "Business Continuity Plan",
  "GDPR/DPA",
  "Insurance Certificate",
];

// Check if document is expiring within 30 days
function isExpiringSoon(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return expiry > now && expiry <= thirtyDaysFromNow;
}

// Check if document is expired
function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique vendors that have documents
  const vendorsWithDocs = useMemo(() => {
    const uniqueVendorIds = [...new Set(documents.map((d) => d.vendorId))];
    return vendors.filter((v) => uniqueVendorIds.includes(v.id));
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVendor =
        vendorFilter === "all" || doc.vendorId === vendorFilter;
      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesVendor && matchesType && matchesStatus;
    });
  }, [searchQuery, vendorFilter, typeFilter, statusFilter]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Stats
  const stats = {
    total: documents.length,
    uploaded: documents.filter((d) => d.status === "Uploaded").length,
    pending: documents.filter((d) => d.status === "Pending").length,
    expired: documents.filter((d) => d.status === "Expired").length,
    expiringSoon: documents.filter(
      (d) => d.status === "Uploaded" && isExpiringSoon(d.expiryDate)
    ).length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Documents & Checklist
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage compliance documents across all vendors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Total Documents
              </span>
            </div>
            <p className="text-2xl font-semibold text-foreground mt-2">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-risk-low" />
              <span className="text-xs text-muted-foreground">Uploaded</span>
            </div>
            <p className="text-2xl font-semibold text-risk-low mt-2">
              {stats.uploaded}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-risk-high" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-risk-high mt-2">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-risk-critical" />
              <span className="text-xs text-muted-foreground">Expired</span>
            </div>
            <p className="text-2xl font-semibold text-risk-critical mt-2">
              {stats.expired}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-risk-high" />
              <span className="text-xs text-muted-foreground">
                Expiring Soon
              </span>
            </div>
            <p className="text-2xl font-semibold text-risk-high mt-2">
              {stats.expiringSoon}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="checklist">Vendor Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendorsWithDocs.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Uploaded">Uploaded</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documents Table */}
            {isLoading ? (
              <TableSkeleton rows={8} columns={6} />
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Vendor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Expiry
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                          <tr
                            key={doc.id}
                            className={cn(
                              "hover:bg-muted/30 transition-colors",
                              doc.status === "Expired" && "bg-risk-critical/5",
                              isExpiringSoon(doc.expiryDate) &&
                                doc.status === "Uploaded" &&
                                "bg-risk-high/5"
                            )}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                  {doc.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-muted-foreground">
                                {doc.vendorName}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-muted-foreground">
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <DocumentStatusBadge status={doc.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(doc.uploadedDate)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={cn(
                                  "text-sm",
                                  isExpired(doc.expiryDate)
                                    ? "text-risk-critical font-medium"
                                    : isExpiringSoon(doc.expiryDate)
                                    ? "text-risk-high font-medium"
                                    : "text-muted-foreground"
                                )}
                              >
                                {formatDate(doc.expiryDate)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4 mr-1" />
                                {doc.status === "Uploaded"
                                  ? "Replace"
                                  : "Upload"}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-muted-foreground"
                          >
                            No documents found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Table Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredDocuments.length} of {documents.length}{" "}
                    documents
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6 mt-4">
            {/* Vendor Checklist View */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableSkeleton key={i} rows={6} columns={5} />
                ))}
              </div>
            ) : (
              vendorsWithDocs.map((vendor) => {
                const vendorDocs = documents.filter(
                  (d) => d.vendorId === vendor.id
                );
                return (
                  <div
                    key={vendor.id}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="p-4 border-b border-border bg-muted/30">
                      <h3 className="text-sm font-medium text-foreground">
                        {vendor.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {vendor.category} · {vendor.country}
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {documentTypes.map((type) => {
                        const doc = vendorDocs.find((d) => d.type === type);
                        return (
                          <div
                            key={type}
                            className={cn(
                              "flex items-center justify-between px-4 py-3",
                              doc?.status === "Expired" && "bg-risk-critical/5",
                              doc &&
                                isExpiringSoon(doc.expiryDate) &&
                                doc.status === "Uploaded" &&
                                "bg-risk-high/5"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {type}
                                </p>
                                {doc?.expiryDate && (
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isExpired(doc.expiryDate)
                                        ? "text-risk-critical"
                                        : isExpiringSoon(doc.expiryDate)
                                        ? "text-risk-high"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {isExpired(doc.expiryDate)
                                      ? "Expired"
                                      : isExpiringSoon(doc.expiryDate)
                                      ? "Expiring soon"
                                      : `Expires ${formatDate(doc.expiryDate)}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {doc ? (
                                <>
                                  <DocumentStatusBadge status={doc.status} />
                                  <Button variant="ghost" size="sm">
                                    <Upload className="h-4 w-4 mr-1" />
                                    {doc.status === "Uploaded"
                                      ? "Replace"
                                      : "Upload"}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs text-muted-foreground">
                                    Not required
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

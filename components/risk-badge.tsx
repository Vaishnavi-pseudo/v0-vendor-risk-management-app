import { cn } from "@/lib/utils";
import type { RiskLevel, VendorStatus, DocumentStatus, AlertSeverity } from "@/lib/mock-data";

interface RiskBadgeProps {
  level: RiskLevel | AlertSeverity;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-risk-low/20 text-risk-low": level === "Low",
          "bg-risk-medium/20 text-risk-medium": level === "Medium",
          "bg-risk-high/20 text-risk-high": level === "High",
          "bg-risk-critical/20 text-risk-critical": level === "Critical",
        },
        className
      )}
    >
      {level}
    </span>
  );
}

interface StatusBadgeProps {
  status: VendorStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-risk-low/20 text-risk-low": status === "Active",
          "bg-risk-high/20 text-risk-high": status === "Under Review",
          "bg-muted text-muted-foreground": status === "Offboarded",
          "bg-risk-medium/20 text-risk-medium": status === "Pending Approval",
        },
        className
      )}
    >
      {status}
    </span>
  );
}

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-risk-low/20 text-risk-low": status === "Uploaded",
          "bg-risk-high/20 text-risk-high": status === "Pending",
          "bg-risk-critical/20 text-risk-critical": status === "Expired",
        },
        className
      )}
    >
      {status}
    </span>
  );
}

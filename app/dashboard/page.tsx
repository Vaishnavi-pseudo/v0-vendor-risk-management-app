import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { RiskBadge, StatusBadge } from "@/components/risk-badge";
import {
  StatCardSkeleton,
  ChartSkeleton,
  ActivityFeedSkeleton,
  TableSkeleton,
} from "@/components/skeletons";
import {
  dashboardStats,
  riskDistributionByCategory,
  activityFeed,
  vendors,
} from "@/lib/mock-data";
import {
  Building2,
  AlertTriangle,
  Clock,
  FileWarning,
  Circle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const topHighRiskVendors = vendors
    .filter((v) => v.status !== "Offboarded")
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 5);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return `${diffDays}d ago`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your third-party risk management program
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Vendors"
              value={dashboardStats.totalVendors}
              description="Active vendor relationships"
              icon={Building2}
              iconBg="bg-primary/10"
              iconColor="text-primary"
            />
            <StatCard
              title="High Risk Vendors"
              value={dashboardStats.highRiskVendors}
              description="Require close monitoring"
              icon={AlertTriangle}
              iconBg="bg-risk-high/10"
              iconColor="text-risk-high"
            />
            <StatCard
              title="Pending Reviews"
              value={dashboardStats.pendingReviews}
              description="Awaiting assessment"
              icon={Clock}
              iconBg="bg-risk-medium/10"
              iconColor="text-risk-medium"
            />
            <StatCard
              title="Documents Overdue"
              value={dashboardStats.documentsOverdue}
              description="Expired or pending upload"
              icon={FileWarning}
              iconBg="bg-risk-critical/10"
              iconColor="text-risk-critical"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-base font-medium text-card-foreground mb-6">
                  Risk Distribution by Category
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={riskDistributionByCategory}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value) => (
                        <span style={{ color: "var(--foreground)", fontSize: "12px" }}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </span>
                      )}
                    />
                    <Bar
                      dataKey="low"
                      name="Low"
                      stackId="a"
                      fill="var(--risk-low)"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="medium"
                      name="Medium"
                      stackId="a"
                      fill="var(--risk-medium)"
                    />
                    <Bar
                      dataKey="high"
                      name="High"
                      stackId="a"
                      fill="var(--risk-high)"
                    />
                    <Bar
                      dataKey="critical"
                      name="Critical"
                      stackId="a"
                      fill="var(--risk-critical)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 h-full">
              <h2 className="text-base font-medium text-card-foreground mb-4">
                Recent Activity
              </h2>
              {isLoading ? (
                <ActivityFeedSkeleton />
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                  {activityFeed.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Circle
                        className={`h-2 w-2 mt-2 shrink-0 fill-current ${
                          event.type === "success"
                            ? "text-risk-low"
                            : event.type === "warning"
                            ? "text-risk-high"
                            : event.type === "error"
                            ? "text-risk-critical"
                            : "text-risk-medium"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-relaxed">
                          {event.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* High Risk Vendors Table */}
        <div>
          {isLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-base font-medium text-card-foreground">
                  Top 5 High-Risk Vendors
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Vendors requiring immediate attention based on residual risk
                  score
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Vendor Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Risk Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Inherent Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topHighRiskVendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-foreground">
                            {vendor.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-muted-foreground">
                            {vendor.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
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
                                style={{
                                  width: `${vendor.residualRiskScore}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {vendor.residualRiskScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RiskBadge level={vendor.inherentRisk} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={vendor.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-card-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

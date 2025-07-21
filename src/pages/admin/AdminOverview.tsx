import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Package, Shield } from "lucide-react";
import Layout from "@/components/Layout";

export default function AdminOverview() {
  const revenueStats = {
    dailyRevenue: 2840.50,
    monthlyRevenue: 78650.25,
    totalOrders: 156,
    avgOrderValue: 18.23,
    profitMargin: 23.5,
    topSellingItem: "Grilled Chicken Sandwich"
  };

  const hrStats = {
    totalEmployees: 24,
    activeEmployees: 22,
    avgWorkHours: 38.5,
    attendanceRate: 94.2,
    pendingLeaves: 3
  };

  return (
    <Layout activeTab="admin" onTabChange={() => window.location.href = '/'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Overview</h1>
            <p className="text-muted-foreground">Dashboard analytics and key metrics</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Access
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">K{revenueStats.dailyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">K{revenueStats.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+15.3% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrStats.activeEmployees}/{hrStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">{hrStats.attendanceRate}% attendance rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Order Value</span>
                <span className="font-semibold">K{revenueStats.avgOrderValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Profit Margin</span>
                <span className="font-semibold">{revenueStats.profitMargin}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Top Selling Item</span>
                <span className="font-semibold text-xs">{revenueStats.topSellingItem}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HR Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Work Hours</span>
                <span className="font-semibold">{hrStats.avgWorkHours}h/week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Leaves</span>
                <span className="font-semibold">{hrStats.pendingLeaves}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <span className="font-semibold">{hrStats.attendanceRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
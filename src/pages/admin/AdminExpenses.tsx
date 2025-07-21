import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import Layout from "@/components/Layout";
import ExpenseManagement from "@/components/ExpenseManagement";

export default function AdminExpenses() {
  return (
    <Layout activeTab="admin" onTabChange={() => window.location.href = '/'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expense Management</h1>
            <p className="text-muted-foreground">Track and manage business expenses</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Access
          </Badge>
        </div>

        <ExpenseManagement />
      </div>
    </Layout>
  );
}
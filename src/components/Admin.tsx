import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Utensils, Package, Shield, TrendingUp, DollarSign, Globe, CreditCard, Receipt, TrendingDown, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, meals, ingredients, and system settings</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Admin Access
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Navigation Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/overview")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <TrendingUp className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Overview</h3>
              <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/users")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Users</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage accounts</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/meals")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Utensils className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Meals</h3>
              <p className="text-xs text-muted-foreground mt-1">Menu items</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/overview")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Package className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Ingredients</h3>
              <p className="text-xs text-muted-foreground mt-1">Inventory</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/overview")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">HR Stats</h3>
              <p className="text-xs text-muted-foreground mt-1">Staff metrics</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/overview")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <DollarSign className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Revenue</h3>
              <p className="text-xs text-muted-foreground mt-1">Sales data</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/overview")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <CreditCard className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Payroll</h3>
              <p className="text-xs text-muted-foreground mt-1">Staff payments</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/sales-entry")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Receipt className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Sales Entry</h3>
              <p className="text-xs text-muted-foreground mt-1">Manual sales</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/expenses")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <TrendingDown className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Expenses</h3>
              <p className="text-xs text-muted-foreground mt-1">Cost tracking</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/store-sync")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Globe className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Store Sync</h3>
              <p className="text-xs text-muted-foreground mt-1">Integration</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => navigate("/admin/reports")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Mail className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Reports</h3>
              <p className="text-xs text-muted-foreground mt-1">Email automation</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
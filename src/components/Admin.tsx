import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Users, Utensils, Package, Settings, Plus, Edit, Trash2, Shield, Eye, EyeOff, TrendingUp, DollarSign, Calendar, Clock, Globe, CreditCard, Receipt, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StoreIntegration from "./StoreIntegration";
import ManualSalesEntry from "./ManualSalesEntry";
import ExpenseManagement from "./ExpenseManagement";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  active: boolean;
  createdAt: string;
}

interface Meal {
  id: string;
  name: string;
  price: number;
  category: string;
  active: boolean;
  description: string;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  supplier: string;
  threshold: number;
}

interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  avgWorkHours: number;
  attendanceRate: number;
  pendingLeaves: number;
}

interface RevenueStats {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  profitMargin: number;
  topSellingItem: string;
}

export default function Admin() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("overview");

  // HR and Revenue Stats
  const [hrStats] = useState<HRStats>({
    totalEmployees: 24,
    activeEmployees: 22,
    avgWorkHours: 38.5,
    attendanceRate: 94.2,
    pendingLeaves: 3
  });

  const [revenueStats] = useState<RevenueStats>({
    dailyRevenue: 2840.50,
    monthlyRevenue: 78650.25,
    totalOrders: 156,
    avgOrderValue: 18.23,
    profitMargin: 23.5,
    topSellingItem: "Grilled Chicken Sandwich"
  });

  // Sample data
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Admin", email: "john@zedbites.com", role: "admin", active: true, createdAt: "2024-01-15" },
    { id: "2", name: "Sarah Manager", email: "sarah@zedbites.com", role: "manager", active: true, createdAt: "2024-01-20" },
    { id: "3", name: "Mike Staff", email: "mike@zedbites.com", role: "staff", active: true, createdAt: "2024-02-01" }
  ]);

  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", name: "Grilled Chicken Sandwich", price: 12.99, category: "Sandwiches", active: true, description: "Juicy grilled chicken with fresh vegetables" },
    { id: "2", name: "Caesar Salad", price: 9.99, category: "Salads", active: true, description: "Fresh romaine lettuce with caesar dressing" },
    { id: "3", name: "Margherita Pizza", price: 15.99, category: "Pizza", active: false, description: "Classic pizza with mozzarella and basil" }
  ]);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Chicken Breast", unit: "kg", costPerUnit: 8.50, supplier: "Fresh Farms", threshold: 10 },
    { id: "2", name: "Bread Rolls", unit: "pieces", costPerUnit: 0.50, supplier: "Local Bakery", threshold: 50 },
    { id: "3", name: "Lettuce", unit: "kg", costPerUnit: 3.20, supplier: "Green Valley", threshold: 5 }
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "staff" as const, password: "" });
  const [newMeal, setNewMeal] = useState({ name: "", price: 0, category: "", description: "" });
  const [newIngredient, setNewIngredient] = useState({ name: "", unit: "", costPerUnit: 0, supplier: "", threshold: 0 });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers(prev => [...prev, user]);
    setNewUser({ name: "", email: "", role: "staff", password: "" });
    toast({ title: "Success", description: "User added successfully!" });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({ title: "Success", description: "User deleted successfully!" });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    ));
  };

  const handleAddMeal = () => {
    if (!newMeal.name || newMeal.price <= 0 || !newMeal.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      price: newMeal.price,
      category: newMeal.category,
      description: newMeal.description,
      active: true
    };
    
    setMeals(prev => [...prev, meal]);
    setNewMeal({ name: "", price: 0, category: "", description: "" });
    toast({ title: "Success", description: "Meal added successfully!" });
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
    toast({ title: "Success", description: "Meal deleted successfully!" });
  };

  const handleToggleMealStatus = (mealId: string) => {
    setMeals(prev => prev.map(m => 
      m.id === mealId ? { ...m, active: !m.active } : m
    ));
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.unit || newIngredient.costPerUnit <= 0) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: newIngredient.name,
      unit: newIngredient.unit,
      costPerUnit: newIngredient.costPerUnit,
      supplier: newIngredient.supplier,
      threshold: newIngredient.threshold
    };
    
    setIngredients(prev => [...prev, ingredient]);
    setNewIngredient({ name: "", unit: "", costPerUnit: 0, supplier: "", threshold: 0 });
    toast({ title: "Success", description: "Ingredient added successfully!" });
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    setIngredients(prev => prev.filter(i => i.id !== ingredientId));
    toast({ title: "Success", description: "Ingredient deleted successfully!" });
  };

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
            onClick={() => setActiveSection("overview")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <TrendingUp className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Overview</h3>
              <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("users")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Users</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage accounts</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("sales-entry")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Receipt className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Sales Entry</h3>
              <p className="text-xs text-muted-foreground mt-1">Manual sales</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("expenses")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <TrendingDown className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Expenses</h3>
              <p className="text-xs text-muted-foreground mt-1">Cost tracking</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("store-sync")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Globe className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Store Sync</h3>
              <p className="text-xs text-muted-foreground mt-1">Integration</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="transition-all duration-300">
          {activeSection === "overview" && (
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
            </div>
          )}

          {activeSection === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management functionality</p>
              </CardContent>
            </Card>
          )}

          {activeSection === "sales-entry" && <ManualSalesEntry />}
          {activeSection === "expenses" && <ExpenseManagement />}
          {activeSection === "store-sync" && <StoreIntegration />}
        </div>
      </div>
    </div>
  );
}
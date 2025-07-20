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
            onClick={() => setActiveSection("meals")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Utensils className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Meals</h3>
              <p className="text-xs text-muted-foreground mt-1">Menu items</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("ingredients")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Package className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Ingredients</h3>
              <p className="text-xs text-muted-foreground mt-1">Inventory</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("hr")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">HR Stats</h3>
              <p className="text-xs text-muted-foreground mt-1">Staff metrics</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("revenue")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <DollarSign className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Revenue</h3>
              <p className="text-xs text-muted-foreground mt-1">Sales data</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
            onClick={() => setActiveSection("payroll")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <CreditCard className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">Payroll</h3>
              <p className="text-xs text-muted-foreground mt-1">Staff payments</p>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.active ? "default" : "secondary"}>
                            {user.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === "meals" && (
            <Card>
              <CardHeader>
                <CardTitle>Meal Management</CardTitle>
                <CardDescription>Manage menu items and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meals.map((meal) => (
                      <TableRow key={meal.id}>
                        <TableCell className="font-medium">{meal.name}</TableCell>
                        <TableCell>{meal.category}</TableCell>
                        <TableCell>K{meal.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={meal.active ? "default" : "secondary"}>
                            {meal.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === "ingredients" && (
            <Card>
              <CardHeader>
                <CardTitle>Ingredient Management</CardTitle>
                <CardDescription>Manage ingredients, suppliers, and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Cost per Unit</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Threshold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                        <TableCell>K{ingredient.costPerUnit.toFixed(2)}</TableCell>
                        <TableCell>{ingredient.supplier}</TableCell>
                        <TableCell>{ingredient.threshold}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === "hr" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Employees:</span>
                    <span className="font-bold">{hrStats.totalEmployees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Today:</span>
                    <span className="font-bold text-green-600">{hrStats.activeEmployees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attendance Rate:</span>
                    <span className="font-bold text-green-600">{hrStats.attendanceRate}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Work Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Avg Weekly Hours:</span>
                    <span className="font-bold">{hrStats.avgWorkHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Leaves:</span>
                    <span className="font-bold text-blue-600">{hrStats.pendingLeaves}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "revenue" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Daily Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">K{revenueStats.dailyRevenue.toFixed(2)}</div>
                  <p className="text-sm text-green-600">+12.5% vs yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">K{revenueStats.monthlyRevenue.toFixed(2)}</div>
                  <p className="text-sm text-green-600">+8.3% vs last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Average Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">K{revenueStats.avgOrderValue.toFixed(2)}</div>
                  <p className="text-sm text-blue-600">Per order value</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{revenueStats.profitMargin}%</div>
                  <p className="text-sm text-green-600">Above target</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "payroll" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">K45,680</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employees Paid</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22</div>
                  <p className="text-xs text-muted-foreground">of 24 total staff</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">K3,400 total</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "sales-entry" && <ManualSalesEntry />}
          {activeSection === "expenses" && <ExpenseManagement />}
          {activeSection === "store-sync" && <StoreIntegration />}
        </div>
      </div>
    </div>
  );
}
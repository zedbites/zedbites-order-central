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
import { Users, Utensils, Package, Settings, Plus, Edit, Trash2, Shield, Eye, EyeOff, TrendingUp, DollarSign, Calendar, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StoreIntegration from "./StoreIntegration";

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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Meals
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="hr" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            HR Stats
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="store-sync" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Store Sync
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueStats.dailyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueStats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+8% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrStats.activeEmployees}</div>
                <p className="text-xs text-muted-foreground">of {hrStats.totalEmployees} total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrStats.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">Above target</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Staff Member
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Utensils className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Update Inventory
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">HR</Badge>
                  <span className="text-sm">New employee Sarah joined</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Revenue</Badge>
                  <span className="text-sm">Daily target achieved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Inventory</Badge>
                  <span className="text-sm">Low stock alert: Chicken breast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Menu</Badge>
                  <span className="text-sm">New item added: Caesar Wrap</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* HR Stats Tab */}
        <TabsContent value="hr" className="space-y-4">
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
                  <span>On Leave:</span>
                  <span className="font-bold text-yellow-600">{hrStats.totalEmployees - hrStats.activeEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Leaves:</span>
                  <span className="font-bold text-blue-600">{hrStats.pendingLeaves}</span>
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
                  <span>Attendance Rate:</span>
                  <span className="font-bold text-green-600">{hrStats.attendanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Overtime Hours:</span>
                  <span className="font-bold">24.5</span>
                </div>
                <div className="flex justify-between">
                  <span>Late Arrivals:</span>
                  <span className="font-bold text-red-600">8</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Customer Rating:</span>
                  <span className="font-bold text-green-600">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Accuracy:</span>
                  <span className="font-bold">97.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Service Time:</span>
                  <span className="font-bold">12 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Hours:</span>
                  <span className="font-bold">156</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff Schedule</CardTitle>
              <CardDescription>Today's shift assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>9:00 AM - 6:00 PM</TableCell>
                    <TableCell>9h</TableCell>
                    <TableCell><Badge variant="default">Present</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mike Chen</TableCell>
                    <TableCell>Chef</TableCell>
                    <TableCell>10:00 AM - 7:00 PM</TableCell>
                    <TableCell>9h</TableCell>
                    <TableCell><Badge variant="default">Present</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Emma Davis</TableCell>
                    <TableCell>Server</TableCell>
                    <TableCell>11:00 AM - 8:00 PM</TableCell>
                    <TableCell>9h</TableCell>
                    <TableCell><Badge variant="destructive">Late</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>John Wilson</TableCell>
                    <TableCell>Kitchen Staff</TableCell>
                    <TableCell>2:00 PM - 10:00 PM</TableCell>
                    <TableCell>8h</TableCell>
                    <TableCell><Badge variant="secondary">Upcoming</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Daily Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${revenueStats.dailyRevenue.toFixed(2)}</div>
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
                <div className="text-3xl font-bold">${revenueStats.monthlyRevenue.toFixed(2)}</div>
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
                <div className="text-3xl font-bold">${revenueStats.avgOrderValue.toFixed(2)}</div>
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Today's sales by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Sandwiches</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <span className="font-bold">$1,278</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Salads</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <span className="font-bold">$852</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Beverages</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                    <span className="font-bold">$568</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Desserts</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="font-bold">$426</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performers today</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Grilled Chicken Sandwich</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>$415.68</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Caesar Salad</TableCell>
                      <TableCell>28</TableCell>
                      <TableCell>$279.72</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Coffee</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>$157.50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Margherita Pizza</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>$287.82</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Revenue by payment type today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">$1,420</div>
                  <p className="text-sm text-muted-foreground">Credit Card (50%)</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$852</div>
                  <p className="text-sm text-muted-foreground">Cash (30%)</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$426</div>
                  <p className="text-sm text-muted-foreground">Mobile Pay (15%)</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$142</div>
                  <p className="text-sm text-muted-foreground">Other (5%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Sync Tab */}
        <TabsContent value="store-sync" className="space-y-4">
          <StoreIntegration />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their roles</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account for the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="userName">Full Name</Label>
                        <Input
                          id="userName"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="userEmail">Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="userPassword">Password</Label>
                        <div className="relative">
                          <Input
                            id="userPassword"
                            type={showPassword ? "text" : "password"}
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="userRole">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as any }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddUser} className="w-full">Add User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.active}
                            onCheckedChange={() => handleToggleUserStatus(user.id)}
                          />
                          <span className="text-sm">{user.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meals Tab */}
        <TabsContent value="meals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meal Management</CardTitle>
                  <CardDescription>Manage menu items and pricing</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Meal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Meal</DialogTitle>
                      <DialogDescription>Add a new item to the menu</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mealName">Meal Name</Label>
                        <Input
                          id="mealName"
                          value={newMeal.name}
                          onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter meal name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mealPrice">Price ($)</Label>
                        <Input
                          id="mealPrice"
                          type="number"
                          step="0.01"
                          value={newMeal.price || ""}
                          onChange={(e) => setNewMeal(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mealCategory">Category</Label>
                        <Select value={newMeal.category} onValueChange={(value) => setNewMeal(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                            <SelectItem value="Salads">Salads</SelectItem>
                            <SelectItem value="Pizza">Pizza</SelectItem>
                            <SelectItem value="Beverages">Beverages</SelectItem>
                            <SelectItem value="Desserts">Desserts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mealDescription">Description</Label>
                        <Input
                          id="mealDescription"
                          value={newMeal.description}
                          onChange={(e) => setNewMeal(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter meal description"
                        />
                      </div>
                      <Button onClick={handleAddMeal} className="w-full">Add Meal</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meals.map((meal) => (
                    <TableRow key={meal.id}>
                      <TableCell className="font-medium">{meal.name}</TableCell>
                      <TableCell>{meal.category}</TableCell>
                      <TableCell>${meal.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={meal.active}
                            onCheckedChange={() => handleToggleMealStatus(meal.id)}
                          />
                          <span className="text-sm">{meal.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{meal.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {meal.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMeal(meal.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ingredients Tab */}
        <TabsContent value="ingredients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ingredient Management</CardTitle>
                  <CardDescription>Manage ingredients, suppliers, and costs</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Ingredient
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Ingredient</DialogTitle>
                      <DialogDescription>Add a new ingredient to the inventory</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ingredientName">Ingredient Name</Label>
                        <Input
                          id="ingredientName"
                          value={newIngredient.name}
                          onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter ingredient name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ingredientUnit">Unit</Label>
                        <Select value={newIngredient.unit} onValueChange={(value) => setNewIngredient(prev => ({ ...prev, unit: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="g">Grams (g)</SelectItem>
                            <SelectItem value="l">Liters (l)</SelectItem>
                            <SelectItem value="ml">Milliliters (ml)</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ingredientCost">Cost per Unit ($)</Label>
                        <Input
                          id="ingredientCost"
                          type="number"
                          step="0.01"
                          value={newIngredient.costPerUnit || ""}
                          onChange={(e) => setNewIngredient(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) || 0 }))}
                          placeholder="Enter cost per unit"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ingredientSupplier">Supplier</Label>
                        <Input
                          id="ingredientSupplier"
                          value={newIngredient.supplier}
                          onChange={(e) => setNewIngredient(prev => ({ ...prev, supplier: e.target.value }))}
                          placeholder="Enter supplier name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ingredientThreshold">Low Stock Threshold</Label>
                        <Input
                          id="ingredientThreshold"
                          type="number"
                          value={newIngredient.threshold || ""}
                          onChange={(e) => setNewIngredient(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                          placeholder="Enter threshold amount"
                        />
                      </div>
                      <Button onClick={handleAddIngredient} className="w-full">Add Ingredient</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell className="font-medium">{ingredient.name}</TableCell>
                      <TableCell>{ingredient.unit}</TableCell>
                      <TableCell>${ingredient.costPerUnit.toFixed(2)}</TableCell>
                      <TableCell>{ingredient.supplier}</TableCell>
                      <TableCell>{ingredient.threshold}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {ingredient.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteIngredient(ingredient.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure general system preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoOrders">Auto Order Processing</Label>
                    <p className="text-sm text-muted-foreground">Automatically process incoming orders</p>
                  </div>
                  <Switch id="autoOrders" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStock">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert when ingredients are running low</p>
                  </div>
                  <Switch id="lowStock" defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Configure business-specific settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="ZedBites Restaurant" />
                </div>
                <div>
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input id="businessEmail" type="email" defaultValue="contact@zedbites.com" />
                </div>
                <div>
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input id="businessPhone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" step="0.01" defaultValue="8.5" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

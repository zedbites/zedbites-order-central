import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Plus, 
  Minus,
  Package,
  TrendingDown,
  Search
} from "lucide-react";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory] = useState([
    {
      id: 1,
      name: "Tomatoes",
      category: "Vegetables",
      currentStock: 2,
      threshold: 10,
      unit: "kg",
      costPerUnit: 15,
      supplier: "Fresh Farms Ltd"
    },
    {
      id: 2,
      name: "Onions", 
      category: "Vegetables",
      currentStock: 3,
      threshold: 15,
      unit: "kg",
      costPerUnit: 12,
      supplier: "Fresh Farms Ltd"
    },
    {
      id: 3,
      name: "Cooking Oil",
      category: "Pantry",
      currentStock: 1,
      threshold: 5,
      unit: "litres",
      costPerUnit: 35,
      supplier: "Kitchen Supplies Co"
    },
    {
      id: 4,
      name: "Salt",
      category: "Seasoning", 
      currentStock: 0.5,
      threshold: 2,
      unit: "kg",
      costPerUnit: 8,
      supplier: "Kitchen Supplies Co"
    },
    {
      id: 5,
      name: "Rice",
      category: "Grains",
      currentStock: 25,
      threshold: 10,
      unit: "kg", 
      costPerUnit: 18,
      supplier: "Grain Masters"
    },
    {
      id: 6,
      name: "Chicken",
      category: "Protein",
      currentStock: 12,
      threshold: 8,
      unit: "kg",
      costPerUnit: 45,
      supplier: "Fresh Meat Co"
    },
    {
      id: 7,
      name: "Beef",
      category: "Protein", 
      currentStock: 8,
      threshold: 5,
      unit: "kg",
      costPerUnit: 65,
      supplier: "Fresh Meat Co"
    },
    {
      id: 8,
      name: "Fish",
      category: "Protein",
      currentStock: 6,
      threshold: 4,
      unit: "kg",
      costPerUnit: 55,
      supplier: "Ocean Fresh"
    }
  ]);

  const [wastageItems] = useState([
    { item: "Tomatoes", quantity: 1.5, reason: "Spoiled", date: "Today", cost: 22.5 },
    { item: "Onions", quantity: 0.8, reason: "Expired", date: "Yesterday", cost: 9.6 },
    { item: "Rice", quantity: 2, reason: "Pest damage", date: "2 days ago", cost: 36 },
  ]);

  const getStockStatus = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100;
    if (percentage <= 50) return { status: 'critical', color: 'bg-destructive text-destructive-foreground' };
    if (percentage <= 100) return { status: 'low', color: 'bg-warning text-warning-foreground' };
    return { status: 'good', color: 'bg-success text-success-foreground' };
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalItems = inventory.filter(item => getStockStatus(item.currentStock, item.threshold).status === 'critical');
  const lowStockItems = inventory.filter(item => getStockStatus(item.currentStock, item.threshold).status === 'low');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">
          Track stock levels, manage wastage, and monitor inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Critical Stock</p>
                <p className="text-2xl font-bold text-destructive">{criticalItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>  
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Wastage</p>
                <p className="text-2xl font-bold">K{wastageItems.reduce((sum, item) => sum + item.cost, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Inventory */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Items</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Inventory Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="itemName">Item Name</Label>
                        <Input id="itemName" placeholder="Enter item name" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" placeholder="Enter category" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="stock">Current Stock</Label>
                          <Input id="stock" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Input id="unit" placeholder="kg, litres, etc." />
                        </div>
                      </div>
                      <Button className="w-full">Add Item</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.currentStock, item.threshold);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge className={stockStatus.color}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.currentStock} {item.unit} • Threshold: {item.threshold} {item.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          K{item.costPerUnit}/{item.unit} • {item.supplier}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 font-medium">{item.currentStock}</span>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wastage Tracking */}
        <div>
          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Recent Wastage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wastageItems.map((item, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.quantity} kg</p>
                        <p className="text-sm text-destructive">K{item.cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Wastage
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Wastage</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wasteItem">Item</Label>
                      <Input id="wasteItem" placeholder="Select item" />
                    </div>
                    <div>
                      <Label htmlFor="wasteQuantity">Quantity Wasted</Label>
                      <Input id="wasteQuantity" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="wasteReason">Reason</Label>
                      <Input id="wasteReason" placeholder="Spoiled, expired, etc." />
                    </div>
                    <Button className="w-full">Log Wastage</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
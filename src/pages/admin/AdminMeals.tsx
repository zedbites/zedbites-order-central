import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Utensils, Plus, Edit, Trash2, Shield, ImageIcon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

interface Meal {
  id: string;
  name: string;
  price: number;
  category: string;
  active: boolean;
  description?: string;
  prepTime?: number;
  calories?: number;
  imageUrl?: string;
}

export default function AdminMeals() {
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", name: "Grilled Chicken Sandwich", price: 12.99, category: "Sandwiches", active: true, description: "Juicy grilled chicken with fresh vegetables" },
    { id: "2", name: "Caesar Salad", price: 9.99, category: "Salads", active: true, description: "Fresh romaine lettuce with caesar dressing" },
    { id: "3", name: "Margherita Pizza", price: 15.99, category: "Pizza", active: false, description: "Classic pizza with mozzarella and basil" }
  ]);

  const [newMeal, setNewMeal] = useState({ 
    id: '', 
    name: "", 
    price: 0, 
    category: "", 
    description: "", 
    prepTime: 0, 
    calories: 0, 
    active: true 
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `meal-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('meal-images')
        .getPublicUrl(filePath);

      toast({ title: "Success", description: "Image uploaded successfully!" });
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name || newMeal.price <= 0 || !newMeal.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    let imageUrl = undefined;
    if (selectedFile) {
      imageUrl = await handleImageUpload(selectedFile);
    }
    
    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      price: newMeal.price,
      category: newMeal.category,
      description: newMeal.description,
      prepTime: newMeal.prepTime || undefined,
      calories: newMeal.calories || undefined,
      imageUrl,
      active: true
    };
    
    setMeals(prev => [...prev, meal]);
    setNewMeal({ id: '', name: "", price: 0, category: "", description: "", prepTime: 0, calories: 0, active: true });
    setSelectedFile(null);
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

  return (
    <Layout activeTab="admin" onTabChange={() => window.location.href = '/'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meals Management</h1>
            <p className="text-muted-foreground">Manage menu items and their details</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Access
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>Manage meals, prices, and availability</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Meal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogDescription>Create a new menu item</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meal-name">Meal Name *</Label>
                      <Input
                        id="meal-name"
                        value={newMeal.name}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter meal name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (K) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newMeal.price || ''}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={newMeal.category}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Sandwiches, Salads"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prep-time">Prep Time (minutes)</Label>
                      <Input
                        id="prep-time"
                        type="number"
                        value={newMeal.prepTime || ''}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                        placeholder="15"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newMeal.description}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the meal..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={newMeal.calories || ''}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                        placeholder="450"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="flex-1"
                        />
                        {selectedFile && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddMeal} className="w-full" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Add Meal'
                    )}
                  </Button>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{meal.name}</div>
                        {meal.description && (
                          <div className="text-sm text-muted-foreground">{meal.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{meal.category}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">K{meal.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={meal.active}
                          onCheckedChange={() => handleToggleMealStatus(meal.id)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {meal.active ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this meal? This action cannot be undone.
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
      </div>
    </Layout>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, Plus, DollarSign, TrendingDown, TrendingUp, Receipt, Package, Zap, Home, Car, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  date: Date;
  category: 'ingredients' | 'utilities' | 'rent' | 'transport' | 'equipment' | 'marketing' | 'staff' | 'other';
  subcategory?: string;
  description: string;
  amount: number;
  supplier?: string;
  receiptNumber?: string;
  notes?: string;
  entryDate: Date;
  enteredBy: string;
}

interface ProfitAnalysis {
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  profitMargin: number;
  expenseBreakdown: { [key: string]: number };
}

// Sample revenue data - in real app this would come from sales
const sampleRevenue = {
  daily: 2840.50,
  weekly: 19883.50,
  monthly: 78650.25
};

export default function ExpenseManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    // Sample expenses
    {
      id: "1",
      date: new Date('2024-01-15'),
      category: 'ingredients',
      subcategory: 'Meat',
      description: 'Chicken breast - 50kg',
      amount: 425.00,
      supplier: 'Fresh Farms Ltd',
      receiptNumber: 'FF-2024-001',
      entryDate: new Date('2024-01-15'),
      enteredBy: 'Admin User'
    },
    {
      id: "2", 
      date: new Date('2024-01-15'),
      category: 'utilities',
      description: 'Electricity bill - January',
      amount: 890.50,
      supplier: 'ZESCO',
      receiptNumber: 'ZE-2024-001',
      entryDate: new Date('2024-01-15'),
      enteredBy: 'Admin User'
    }
  ]);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [supplier, setSupplier] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [notes, setNotes] = useState("");

  const expenseCategories = [
    { value: 'ingredients', label: 'Ingredients & Food', icon: Package },
    { value: 'utilities', label: 'Utilities', icon: Zap },
    { value: 'rent', label: 'Rent & Property', icon: Home },
    { value: 'transport', label: 'Transport & Delivery', icon: Car },
    { value: 'equipment', label: 'Equipment & Maintenance', icon: Package },
    { value: 'marketing', label: 'Marketing & Advertising', icon: TrendingUp },
    { value: 'staff', label: 'Staff & Training', icon: Package },
    { value: 'other', label: 'Other Expenses', icon: Receipt }
  ];

  const subcategoriesByCategory = {
    ingredients: ['Meat', 'Vegetables', 'Dairy', 'Grains', 'Spices', 'Beverages', 'Other'],
    utilities: ['Electricity', 'Water', 'Gas', 'Internet', 'Phone'],
    rent: ['Building Rent', 'Equipment Lease', 'Storage'],
    transport: ['Fuel', 'Delivery', 'Vehicle Maintenance'],
    equipment: ['Kitchen Equipment', 'POS System', 'Furniture', 'Repairs'],
    marketing: ['Advertising', 'Promotions', 'Social Media'],
    staff: ['Training', 'Uniforms', 'Benefits'],
    other: ['Insurance', 'Licenses', 'Professional Services', 'Miscellaneous']
  };

  const handleAddExpense = () => {
    if (!category || !description || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: selectedDate,
      category: category as Expense['category'],
      subcategory: subcategory || undefined,
      description,
      amount: parseFloat(amount),
      supplier: supplier || undefined,
      receiptNumber: receiptNumber || undefined,
      notes: notes || undefined,
      entryDate: new Date(),
      enteredBy: "Admin User"
    };

    setExpenses(prev => [newExpense, ...prev]);
    
    // Reset form
    setCategory("");
    setSubcategory("");
    setDescription("");
    setAmount("");
    setSupplier("");
    setReceiptNumber("");
    setNotes("");
    setSelectedDate(new Date());
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: `Expense added for ${format(selectedDate, "PPP")}`,
    });
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData?.icon || Receipt;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      ingredients: 'bg-green-100 text-green-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      rent: 'bg-blue-100 text-blue-800',
      transport: 'bg-purple-100 text-purple-800',
      equipment: 'bg-gray-100 text-gray-800',
      marketing: 'bg-pink-100 text-pink-800',
      staff: 'bg-indigo-100 text-indigo-800',
      other: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const calculateProfitAnalysis = (): ProfitAnalysis => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalRevenue = sampleRevenue.monthly; // Using monthly revenue
    const grossProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const expenseBreakdown = expenses.reduce((breakdown, expense) => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
      return breakdown;
    }, {} as { [key: string]: number });

    return {
      totalRevenue,
      totalExpenses,
      grossProfit,
      profitMargin,
      expenseBreakdown
    };
  };

  const analysis = calculateProfitAnalysis();

  const getExpensesByCategory = (categoryFilter: string) => {
    return expenses.filter(expense => expense.category === categoryFilter);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expense Management</h2>
          <p className="text-muted-foreground">Track operational expenses and analyze profitability</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Date and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expense Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={(value) => {
                    setCategory(value);
                    setSubcategory(""); // Reset subcategory when category changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {expenseCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subcategory and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category && subcategoriesByCategory[category as keyof typeof subcategoriesByCategory] && (
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Select value={subcategory} onValueChange={setSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-popover">
                        {subcategoriesByCategory[category as keyof typeof subcategoriesByCategory].map(sub => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (K) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the expense"
                />
              </div>

              {/* Supplier and Receipt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier/Vendor</Label>
                  <Input
                    id="supplier"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Supplier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt/Invoice Number</Label>
                  <Input
                    id="receiptNumber"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="Receipt number"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about this expense..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profit/Loss Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">K{analysis.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Monthly revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">K{analysis.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All recorded expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analysis.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              K{analysis.grossProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Revenue - Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            {analysis.profitMargin >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-600" /> : 
              <TrendingDown className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analysis.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.profitMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Profit percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Analysis */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
          <TabsTrigger value="all-expenses">All Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysis.expenseBreakdown).map(([category, amount]) => {
                  const percentage = analysis.totalExpenses > 0 ? (amount / analysis.totalExpenses) * 100 : 0;
                  const CategoryIcon = getCategoryIcon(category);
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4" />
                        <span className="capitalize">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-bold min-w-[80px] text-right">K{amount.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue to Expense Ratio:</span>
                    <span className="font-bold">
                      {analysis.totalExpenses > 0 ? (analysis.totalRevenue / analysis.totalExpenses).toFixed(2) : '∞'}:1
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expense Rate:</span>
                    <span className="font-bold">
                      {analysis.totalRevenue > 0 ? ((analysis.totalExpenses / analysis.totalRevenue) * 100).toFixed(1) : 0}% of revenue
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Avg Expenses:</span>
                    <span className="font-bold">K{(analysis.totalExpenses / 30).toFixed(2)}</span>
                  </div>
                </div>

                {analysis.profitMargin < 10 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Low profit margin. Consider reviewing expenses.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-category" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map(category => {
              const categoryExpenses = getExpensesByCategory(category.value);
              const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
              const CategoryIcon = category.icon;

              return (
                <Card key={category.value}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CategoryIcon className="h-5 w-5" />
                      {category.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">K{categoryTotal.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {categoryExpenses.length} transactions
                      </div>
                      {categoryExpenses.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Avg: K{(categoryTotal / categoryExpenses.length).toFixed(2)} per transaction
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="all-expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No expenses recorded yet</p>
                  <p className="text-sm">Click "Add Expense" to start tracking</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Receipt #</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map(expense => (
                      <TableRow key={expense.id}>
                        <TableCell>{format(expense.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(expense.category)}>
                            {expense.subcategory || expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.supplier || '-'}</TableCell>
                        <TableCell className="font-semibold">K{expense.amount.toFixed(2)}</TableCell>
                        <TableCell className="font-mono text-sm">{expense.receiptNumber || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
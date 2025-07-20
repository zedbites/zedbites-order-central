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
import { format } from "date-fns";
import { CalendarIcon, Plus, DollarSign, Receipt, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface ManualSale {
  id: string;
  date: Date;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  notes?: string;
  entryDate: Date;
  enteredBy: string;
}

const availableItems = [
  { id: "1", name: "Grilled Chicken Sandwich", price: 12.99 },
  { id: "2", name: "Caesar Salad", price: 9.99 },
  { id: "3", name: "Margherita Pizza", price: 15.99 },
  { id: "4", name: "Fish & Chips", price: 14.50 },
  { id: "5", name: "Beef Stew", price: 13.75 },
  { id: "6", name: "Chicken Curry", price: 11.99 },
  { id: "7", name: "Coffee", price: 3.50 },
  { id: "8", name: "Soft Drink", price: 2.25 },
];

export default function ManualSalesEntry() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [salesHistory, setSalesHistory] = useState<ManualSale[]>([]);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  
  // Item entry state
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    const selectedItem = availableItems.find(item => item.id === selectedItemId);
    if (!selectedItem || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please select an item and valid quantity",
        variant: "destructive"
      });
      return;
    }

    const newItem: SaleItem = {
      id: Date.now().toString(),
      name: selectedItem.name,
      quantity,
      price: selectedItem.price,
      total: selectedItem.price * quantity
    };

    setItems(prev => [...prev, newItem]);
    setSelectedItemId("");
    setQuantity(1);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.16; // 16% VAT
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error", 
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    const newSale: ManualSale = {
      id: `MS-${Date.now()}`,
      date: selectedDate,
      items: [...items],
      subtotal,
      tax,
      total,
      paymentMethod,
      customerName: customerName || undefined,
      notes: notes || undefined,
      entryDate: new Date(),
      enteredBy: "Admin User" // In real app, this would come from authentication
    };

    setSalesHistory(prev => [newSale, ...prev]);
    
    // Reset form
    setItems([]);
    setPaymentMethod("");
    setCustomerName("");
    setNotes("");
    setSelectedDate(new Date());
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: `Manual sale entry created for ${format(selectedDate, "PPP")}`,
    });
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'mobile': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manual Sales Entry</h2>
          <p className="text-muted-foreground">Enter sales for past dates or manual transactions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Manual Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Manual Sale Entry</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Date and Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sale Date</Label>
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
                  <Label htmlFor="customerName">Customer Name (Optional)</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Items</h3>
                
                {/* Add Item */}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Select Item</Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - K{item.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button onClick={addItem}>Add</Button>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>K{item.price.toFixed(2)}</TableCell>
                          <TableCell>K{item.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Totals */}
              {items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">K{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (16%):</span>
                    <span className="font-medium">K{calculateTax(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>K{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="mobile">Mobile Money</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this sale..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Create Sale Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Manual Sales History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {salesHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No manual sales entries yet</p>
              <p className="text-sm">Click "Add Manual Sale" to create your first entry</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Entry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesHistory.map(sale => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono">{sale.id}</TableCell>
                    <TableCell>{format(sale.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{sale.customerName || "Walk-in"}</TableCell>
                    <TableCell>{sale.items.length} items</TableCell>
                    <TableCell className="font-semibold">K{sale.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                        {sale.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(sale.entryDate, "MMM dd, HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {salesHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Manual Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                K{salesHistory.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {salesHistory.length} entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                K{(salesHistory.reduce((sum, sale) => sum + sale.total, 0) / salesHistory.length).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesHistory.reduce((sum, sale) => 
                  sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total quantity
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
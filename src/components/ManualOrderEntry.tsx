import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, User, Phone, MapPin, ShoppingCart, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  notes?: string;
}

interface ManualOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'placed' | 'cooking' | 'dispatched' | 'delivered';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  notes?: string;
  createdAt: Date;
  estimatedTime: string;
}

const menuItems: MenuItem[] = [
  { id: "1", name: "Grilled Chicken Sandwich", price: 35.00, category: "Sandwiches", description: "Juicy grilled chicken with fresh vegetables" },
  { id: "2", name: "Caesar Salad", price: 25.00, category: "Salads", description: "Fresh romaine lettuce with caesar dressing" },
  { id: "3", name: "Margherita Pizza", price: 55.00, category: "Pizza", description: "Classic pizza with mozzarella and basil" },
  { id: "4", name: "Fish & Chips", price: 45.00, category: "Main Course", description: "Fresh fish with crispy fries" },
  { id: "5", name: "Beef Stew", price: 40.00, category: "Main Course", description: "Tender beef with vegetables" },
  { id: "6", name: "Chicken Curry", price: 38.00, category: "Main Course", description: "Spicy chicken curry with rice" },
  { id: "7", name: "Vegetable Stir Fry", price: 30.00, category: "Vegetarian", description: "Fresh mixed vegetables" },
  { id: "8", name: "Chocolate Cake", price: 20.00, category: "Desserts", description: "Rich chocolate layer cake" },
  { id: "9", name: "Coffee", price: 8.00, category: "Beverages", description: "Freshly brewed coffee" },
  { id: "10", name: "Fresh Juice", price: 12.00, category: "Beverages", description: "Seasonal fruit juice" },
];

export default function ManualOrderEntry() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  
  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  
  // Item selection state
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState("");

  const addItemToOrder = () => {
    const selectedMenuItem = menuItems.find(item => item.id === selectedMenuItemId);
    if (!selectedMenuItem || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please select a menu item and valid quantity",
        variant: "destructive"
      });
      return;
    }

    const orderItem: OrderItem = {
      id: Date.now().toString(),
      menuItemId: selectedMenuItem.id,
      name: selectedMenuItem.name,
      price: selectedMenuItem.price,
      quantity,
      total: selectedMenuItem.price * quantity,
      notes: itemNotes || undefined
    };

    setOrderItems(prev => [...prev, orderItem]);
    setSelectedMenuItemId("");
    setQuantity(1);
    setItemNotes("");
  };

  const removeItemFromOrder = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.16; // 16% VAT
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const generateEstimatedTime = () => {
    const now = new Date();
    const estimatedMinutes = orderItems.length * 8 + 15; // Base time + prep time per item
    const estimatedTime = new Date(now.getTime() + estimatedMinutes * 60000);
    return estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmitOrder = () => {
    if (!customerName || orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill customer name and add at least one item",
        variant: "destructive"
      });
      return;
    }

    if (orderType === 'delivery' && !customerAddress) {
      toast({
        title: "Error",
        description: "Please provide delivery address",
        variant: "destructive"
      });
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    const newOrder: ManualOrder = {
      id: `ORD-${Date.now()}`,
      customerName,
      customerPhone,
      customerAddress,
      items: [...orderItems],
      subtotal,
      tax,
      total,
      status: 'placed',
      orderType,
      notes: orderNotes || undefined,
      createdAt: new Date(),
      estimatedTime: generateEstimatedTime()
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setOrderType('dine-in');
    setOrderItems([]);
    setOrderNotes("");
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: `Order ${newOrder.id} created successfully!`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'cooking': return 'bg-orange-100 text-orange-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'dine-in': return 'bg-green-100 text-green-800';
      case 'takeaway': return 'bg-blue-100 text-blue-800';
      case 'delivery': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manual Order Entry</h2>
          <p className="text-muted-foreground">Create orders manually from menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+260 XX XXX XXXX"
                  />
                </div>
              </div>

              {/* Order Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <Select value={orderType} onValueChange={(value: 'dine-in' | 'takeaway' | 'delivery') => setOrderType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="dine-in">Dine In</SelectItem>
                      <SelectItem value="takeaway">Takeaway</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {orderType === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="customerAddress">Delivery Address *</Label>
                    <Input
                      id="customerAddress"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Enter delivery address"
                    />
                  </div>
                )}
              </div>

              {/* Menu Items Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add Items</h3>
                
                {/* Item Selection */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <div className="md:col-span-2">
                    <Label>Menu Item</Label>
                    <Select value={selectedMenuItemId} onValueChange={setSelectedMenuItemId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose menu item" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-popover max-h-60">
                        {categories.map(category => (
                          <div key={category}>
                            <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                              {category}
                            </div>
                            {menuItems
                              .filter(item => item.category === category)
                              .map(item => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} - K{item.price.toFixed(2)}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button onClick={addItemToOrder}>Add Item</Button>
                </div>

                {/* Item Notes */}
                <div>
                  <Label htmlFor="itemNotes">Special Instructions (Optional)</Label>
                  <Input
                    id="itemNotes"
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="e.g., extra spicy, no onions"
                  />
                </div>

                {/* Order Items List */}
                {orderItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>K{item.price.toFixed(2)}</TableCell>
                            <TableCell>K{item.total.toFixed(2)}</TableCell>
                            <TableCell>{item.notes || '-'}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItemFromOrder(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              {orderItems.length > 0 && (
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
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Ready Time:</span>
                    <span>{generateEstimatedTime()}</span>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div className="space-y-2">
                <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                <Textarea
                  id="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special requests or notes for this order..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitOrder}>
                  Create Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Manual Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No manual orders created yet</p>
              <p className="text-sm">Click "Create Order" to add your first manual order</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Time</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        {order.customerPhone && (
                          <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getOrderTypeColor(order.orderType)}>
                        {order.orderType.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-semibold">K{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.estimatedTime}</TableCell>
                    <TableCell>{order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
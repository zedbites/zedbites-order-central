import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle,
  Phone,
  MapPin,
  User,
  Navigation,
  Plus
} from "lucide-react";
import DeliveryTracker from "./DeliveryTracker";
import ManualOrderEntry from "./ManualOrderEntry";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [activeView, setActiveView] = useState("all");
  const { toast } = useToast();
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Mukambo",
      phone: "+260 97 123 4567",
      address: "Plot 123, Chelstone, Lusaka",
      items: [
        { name: "Beef Stew", quantity: 2, price: 35 },
        { name: "Rice", quantity: 1, price: 15 }
      ],
      total: 85,
      status: "placed",
      time: "10:30 AM",
      estimatedDelivery: "11:15 AM"
    },
    {
      id: "ORD-002",
      customer: "Mary Tembo", 
      phone: "+260 96 234 5678",
      address: "House 45, Kabulonga, Lusaka",
      items: [
        { name: "Fish & Chips", quantity: 1, price: 55 }
      ],
      total: 55,
      status: "cooking",
      time: "10:15 AM",
      estimatedDelivery: "11:00 AM"
    },
    {
      id: "ORD-003",
      customer: "Peter Banda",
      phone: "+260 95 345 6789", 
      address: "Flat 12, Woodlands, Lusaka",
      items: [
        { name: "Nshima & Chicken", quantity: 3, price: 40 }
      ],
      total: 120,
      status: "dispatched",
      time: "09:45 AM",
      estimatedDelivery: "10:30 AM"
    },
    {
      id: "ORD-004",
      customer: "Grace Mwanza",
      phone: "+260 97 456 7890",
      address: "Shop 8, Northmead, Lusaka", 
      items: [
        { name: "Vegetable Curry", quantity: 2, price: 30 },
        { name: "Chapati", quantity: 4, price: 5 }
      ],
      total: 80,
      status: "delivered",
      time: "09:30 AM",
      estimatedDelivery: "10:15 AM"
    }
  ]);

  const handleLocationUpdate = (orderId: string, location: { lat: number; lng: number }) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              currentLocation: { 
                ...location, 
                timestamp: new Date() 
              } 
            }
          : order
      )
    );
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status updated to ${newStatus}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return <Clock className="h-4 w-4" />;
      case 'cooking': return <ChefHat className="h-4 w-4" />;
      case 'dispatched': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-secondary text-secondary-foreground';
      case 'cooking': return 'bg-warning text-warning-foreground';
      case 'dispatched': return 'bg-info text-info-foreground';
      case 'delivered': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getNextStatus = (status: string) => {
    switch (status) {
      case 'placed': return 'cooking';
      case 'cooking': return 'dispatched';
      case 'dispatched': return 'delivered';
      default: return status;
    }
  };

  const getNextStatusLabel = (status: string) => {
    switch (status) {
      case 'placed': return 'Start Cooking';
      case 'cooking': return 'Mark Dispatched';
      case 'dispatched': return 'Mark Delivered';
      default: return 'Complete';
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{order.id}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{order.customer}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span>{order.address}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-border pt-3">
          <h4 className="font-medium mb-2">Items:</h4>
          <div className="space-y-1">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>K{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-base mt-2 pt-2 border-t border-border">
            <span>Total:</span>
            <span>K{order.total}</span>
          </div>
        </div>

        {/* Time Info */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Ordered: {order.time}</span>
          <span>ETA: {order.estimatedDelivery}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {order.status !== 'delivered' && (
            <Button 
              className="flex-1"
              onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
            >
              {getNextStatusLabel(order.status)}
            </Button>
          )}
          {order.status === 'dispatched' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Navigation className="h-4 w-4 mr-1" />
                  Track
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Delivery Tracking - {order.id}</DialogTitle>
                </DialogHeader>
                <DeliveryTracker 
                  order={order}
                  onLocationUpdate={handleLocationUpdate}
                  onStatusUpdate={handleStatusUpdate}
                />
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" size="sm" onClick={() => window.open(`tel:${order.phone}`)}>
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      {/* Order Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="placed">Placed ({filterOrdersByStatus('placed').length})</TabsTrigger>
          <TabsTrigger value="cooking">Cooking ({filterOrdersByStatus('cooking').length})</TabsTrigger>
          <TabsTrigger value="dispatched">Dispatched ({filterOrdersByStatus('dispatched').length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({filterOrdersByStatus('delivered').length})</TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="placed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOrdersByStatus('placed').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cooking" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOrdersByStatus('cooking').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dispatched" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOrdersByStatus('dispatched').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOrdersByStatus('delivered').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <ManualOrderEntry />
        </TabsContent>
      </Tabs>
    </div>
  );
}
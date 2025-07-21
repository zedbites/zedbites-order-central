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
import { useOrders } from "@/hooks/useOrders";
import LoadingSpinner from "./common/LoadingSpinner";

export default function Orders() {
  const [activeView, setActiveView] = useState("all");
  const { toast } = useToast();
  const { orders, loading, updateOrderStatus, updateOrderLocation } = useOrders();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const handleLocationUpdate = (orderId: string, location: { lat: number; lng: number }) => {
    updateOrderLocation(orderId, location);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
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
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {/* Status indicator stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(order.status).includes('secondary') ? 'bg-secondary' : getStatusColor(order.status).includes('warning') ? 'bg-warning' : getStatusColor(order.status).includes('info') ? 'bg-info' : 'bg-success'}`} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-foreground">{order.order_number}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            {order.customer_name}
          </p>
        </div>
        <Badge variant="outline" className={`${getStatusColor(order.status)} border-0 shadow-sm`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize font-medium">{order.status}</span>
        </Badge>
      </div>

      {/* Contact details */}
      <div className="space-y-2 mb-4">
        {order.customer_phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{order.customer_phone}</span>
          </div>
        )}
        {order.customer_address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{order.customer_address}</span>
          </div>
        )}
      </div>

      {/* Items preview */}
      <div className="mb-4 p-3 rounded-lg bg-muted/30">
        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          {order.items.length} Item{order.items.length > 1 ? 's' : ''}
        </div>
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-foreground">{item.quantity}x {item.item_name}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-xs text-muted-foreground font-medium">
              +{order.items.length - 2} more items...
            </div>
          )}
        </div>
      </div>

      {/* Total and timing */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-foreground">
          K{order.total_amount.toFixed(2)}
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-muted-foreground">
            Ordered: {new Date(order.order_time).toLocaleTimeString()}
          </div>
          {order.estimated_delivery && (
            <div className="text-xs text-muted-foreground">
              ETA: {new Date(order.estimated_delivery).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {order.status !== 'delivered' && (
          <Button 
            size="sm"
            className="flex-1 font-medium"
            onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
          >
            {getNextStatusLabel(order.status)}
          </Button>
        )}
        
        <div className="flex gap-2">
          {order.status === 'dispatched' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="px-3">
                  <Navigation className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Delivery Tracking - {order.order_number}</DialogTitle>
                </DialogHeader>
                <DeliveryTracker 
                  order={order}
                  onLocationUpdate={handleLocationUpdate}
                  onStatusUpdate={handleStatusUpdate}
                />
              </DialogContent>
            </Dialog>
          )}
          {order.customer_phone && (
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3"
              onClick={() => window.open(`tel:${order.customer_phone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
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
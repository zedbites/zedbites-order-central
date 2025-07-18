import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Today's Sales",
      value: "K2,450",
      change: "+12%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Orders",
      value: "23",
      change: "+5",
      changeType: "positive" as const,
      icon: ShoppingCart,
    },
    {
      title: "Low Stock Items",
      value: "4",
      change: "-2",
      changeType: "negative" as const,
      icon: Package,
    },
    {
      title: "Pending Deliveries",
      value: "8",
      change: "+3",
      changeType: "neutral" as const,
      icon: Clock,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Mukambo",
      items: "2x Beef Stew, 1x Rice",
      total: "K85",
      status: "cooking",
      time: "10 mins ago"
    },
    {
      id: "ORD-002", 
      customer: "Mary Tembo",
      items: "1x Fish & Chips",
      total: "K55",
      status: "dispatched",
      time: "15 mins ago"
    },
    {
      id: "ORD-003",
      customer: "Peter Banda",
      items: "3x Nshima & Chicken",
      total: "K120",
      status: "delivered",
      time: "25 mins ago"
    }
  ];

  const lowStockItems = [
    { name: "Tomatoes", current: 2, threshold: 10, unit: "kg" },
    { name: "Onions", current: 3, threshold: 15, unit: "kg" },
    { name: "Cooking Oil", current: 1, threshold: 5, unit: "litres" },
    { name: "Salt", current: 0.5, threshold: 2, unit: "kg" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cooking': return 'bg-warning text-warning-foreground';
      case 'dispatched': return 'bg-info text-info-foreground';
      case 'delivered': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at ZedBites today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-success" />
                  ) : stat.changeType === 'negative' ? (
                    <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                  ) : null}
                  <span className={
                    stat.changeType === 'positive' ? 'text-success' :
                    stat.changeType === 'negative' ? 'text-destructive' :
                    'text-muted-foreground'
                  }>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">from yesterday</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-sm">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Threshold: {item.threshold} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">
                      {item.current} {item.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">remaining</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
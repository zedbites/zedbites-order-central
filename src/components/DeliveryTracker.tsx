import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Clock, Truck, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  total: number;
  estimatedDelivery: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
}

interface DeliveryTrackerProps {
  order: DeliveryOrder;
  onLocationUpdate: (orderId: string, location: { lat: number; lng: number }) => void;
  onStatusUpdate: (orderId: string, status: string) => void;
}

export default function DeliveryTracker({ order, onLocationUpdate, onStatusUpdate }: DeliveryTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number; lng: number} | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (mapRef.current && order.currentLocation) {
      // Initialize a simple map placeholder
      // In a real app, you'd integrate with Google Maps, Mapbox, or similar
      initializeMap();
    }
  }, [order.currentLocation]);

  const initializeMap = () => {
    // Placeholder for map initialization
    // This would be replaced with actual map SDK integration
    console.log("Map initialized for order:", order.id);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive"
      });
      return;
    }

    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setCurrentPosition(newLocation);
        onLocationUpdate(order.id, newLocation);
        
        toast({
          title: "Location Updated",
          description: "Delivery location has been updated",
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Error", 
          description: "Failed to get current location",
          variant: "destructive"
        });
      },
      watchOptions
    );

    setWatchId(id);
    setIsTracking(true);
    
    toast({
      title: "Tracking Started",
      description: "Now tracking delivery location",
    });
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    
    toast({
      title: "Tracking Stopped",
      description: "Location tracking has been disabled",
    });
  };

  const markAsDelivered = () => {
    stopTracking();
    onStatusUpdate(order.id, 'delivered');
    
    toast({
      title: "Order Delivered",
      description: `Order ${order.id} has been marked as delivered`,
    });
  };

  const callCustomer = () => {
    window.open(`tel:${order.phone}`);
  };

  const openMaps = () => {
    // Open in device's default map app
    const address = encodeURIComponent(order.address);
    if (navigator.userAgent.includes('iPhone')) {
      window.open(`maps://maps.google.com/maps?daddr=${address}`);
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Order Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery - {order.id}
            </CardTitle>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Out for Delivery
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.customer}</p>
                <p className="text-sm text-muted-foreground">{order.phone}</p>
              </div>
              <Button variant="outline" size="sm" onClick={callCustomer}>
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">{order.address}</p>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={openMaps}>
                  Open in Maps
                </Button>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>ETA: {order.estimatedDelivery}</span>
            </div>
            <span className="font-medium">Total: K{order.total}</span>
          </div>

          {/* Driver Info */}
          {order.driverName && (
            <div className="text-sm text-muted-foreground border-t pt-3">
              <p>Driver: {order.driverName}</p>
              {order.driverPhone && <p>Phone: {order.driverPhone}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Tracking Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Location Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Location */}
          {currentPosition && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Current Location:</p>
              <p className="text-xs text-muted-foreground">
                Lat: {currentPosition.lat.toFixed(6)}, 
                Lng: {currentPosition.lng.toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Map Placeholder */}
          <div 
            ref={mapRef}
            className="w-full h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border"
          >
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Map view will appear here</p>
              <p className="text-xs">Integrate with Google Maps or Mapbox</p>
            </div>
          </div>

          {/* Tracking Controls */}
          <div className="flex gap-2">
            {!isTracking ? (
              <Button onClick={startTracking} className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopTracking} className="flex-1">
                Stop Tracking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={markAsDelivered} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
            <Button variant="outline" onClick={callCustomer}>
              <Phone className="h-4 w-4 mr-2" />
              Call Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
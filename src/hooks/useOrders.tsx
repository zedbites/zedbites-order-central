import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: 'placed' | 'cooking' | 'dispatched' | 'delivered';
  order_time: string;
  estimated_delivery: string | null;
  current_location: any;
  items: OrderItem[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) throw itemsError;

          return {
            id: order.id,
            order_number: order.order_number,
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            customer_address: order.customer_address,
            total_amount: order.total_amount,
            status: order.status as 'placed' | 'cooking' | 'dispatched' | 'delivered',
            order_time: new Date(order.order_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estimated_delivery: order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
            current_location: order.current_location,
            items: itemsData?.map(item => ({
              id: item.id,
              item_name: item.item_name,
              quantity: item.quantity,
              price: item.price
            })) || []
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    items: Array<{ item_name: string; quantity: number; price: number }>;
  }) => {
    try {
      const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const user = await supabase.auth.getUser();
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          total_amount: total,
          order_number: 'temp', // Will be overwritten by trigger
          ...(user.data.user ? { created_by: user.data.user.id } : {})
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Created",
        description: `Order ${order.order_number} has been created successfully`,
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Update order location
  const updateOrderLocation = async (orderId: string, location: { lat: number; lng: number }) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          current_location: { 
            ...location, 
            timestamp: new Date().toISOString() 
          } 
        })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order location:', error);
      toast({
        title: "Error",
        description: "Failed to update order location",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Set up real-time subscription for orders
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Orders change received:', payload);
        fetchOrders(); // Refetch all orders on any change
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_items'
      }, (payload) => {
        console.log('Order items change received:', payload);
        fetchOrders(); // Refetch all orders on any change
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    updateOrderLocation,
    refetch: fetchOrders
  };
};
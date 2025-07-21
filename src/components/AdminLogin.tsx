import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Admin from "./Admin";

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { toast } = useToast();

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        setCheckingAdmin(true);
        
        // Check if user has admin role in profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const promoteToAdmin = async () => {
    if (!user) return;

    try {
      // Update user's role to admin
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) throw error;

      setIsAdmin(true);
      toast({
        title: "Admin Access Granted",
        description: "You have been promoted to admin. Please refresh the page.",
      });
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin access. Please contact system administrator.",
        variant: "destructive",
      });
    }
  };

  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              You must be logged in to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please log in with your ZedBites account to continue. 
                Admin access is restricted to authorized users only.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button 
                onClick={() => window.location.href = '/auth'} 
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have admin privileges to access this section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Admin access is restricted to authorized users only. 
                Contact your system administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center mb-3">
                <strong>For Demo Purposes:</strong>
              </p>
              <p className="text-xs text-muted-foreground text-center mb-3">
                If you're testing the admin functionality, you can temporarily promote your account:
              </p>
              <Button 
                onClick={promoteToAdmin}
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                Grant Admin Access (Demo Only)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Authenticated as Admin: {user.email}
            </span>
          </div>
          <Alert className="w-auto">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Secure Admin Access Enabled
            </AlertDescription>
          </Alert>
        </div>
        <Admin />
      </div>
    );
  }

  return null;
}
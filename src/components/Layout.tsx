import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings,
  Menu,
  X,
  ChefHat,
  Bell,
  Search,
  LogOut,
  User,
  Mail
} from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (query: string) => void;
  notifications?: number;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', name: 'Orders', icon: ShoppingCart },
  { id: 'inventory', name: 'Inventory', icon: Package },
  { id: 'recipes', name: 'Recipes', icon: ChefHat },
  { id: 'reports', name: 'Reports', icon: Mail },
  { id: 'admin', name: 'Admin', icon: Settings },
];

export default function Layout({ 
  children, 
  activeTab, 
  onTabChange, 
  onSearch,
  notifications = 0 
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Watermark Logo */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/87977d41-0570-4006-badc-b1bbc6c1d90b.png" 
          alt="ZedBites Watermark" 
          className="w-64 h-64 opacity-10 select-none"
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Logo - visible on mobile */}
          <div className="flex items-center space-x-3 md:hidden">
            <img 
              src="/lovable-uploads/98aff0b8-870a-4539-b5e4-fbe9d35e1ec3.png" 
              alt="ZedBites Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Store Manager
            </h1>
          </div>

          {/* Search Bar */}
          {onSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <SearchBar 
                placeholder="Search orders, inventory, customers..." 
                onSearch={onSearch}
              />
            </div>
          )}

          {/* User info and actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  variant="destructive"
                >
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>
            
            {/* User info */}
            <div className="hidden md:flex items-center space-x-2 px-2 py-1 rounded-lg bg-muted/50">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium truncate max-w-32">
                {user?.email}
              </span>
            </div>
            
            {/* Logout button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              title="Sign out"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-elegant transform transition-transform duration-300 ease-in-out mt-16 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Logo - Desktop */}
        <div className="hidden md:flex items-center justify-center h-16 px-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/98aff0b8-870a-4539-b5e4-fbe9d35e1ec3.png" 
              alt="ZedBites Logo" 
              className="w-10 h-10"
            />
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Store Manager
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start mb-2 h-12"
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="md:ml-64 pt-16">
        <div className="p-4 md:p-8 animate-fade-in">
          {children}
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden mt-16"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
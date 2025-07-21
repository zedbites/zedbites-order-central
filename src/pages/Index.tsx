import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Orders from "@/components/Orders";
import Inventory from "@/components/Inventory";
import Recipes from "@/components/Recipes";
import EmailReports from "@/components/EmailReports";
import AdminLogin from "@/components/AdminLogin";
import FloatingActionButton from "@/components/layout/FloatingActionButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useKeyboardShortcuts, defaultShortcuts } from "@/utils/KeyboardShortcuts";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Keyboard shortcuts
  const shortcuts = [
    ...defaultShortcuts.map(shortcut => ({
      ...shortcut,
      action: () => {
        if (shortcut.key === 'd') setActiveTab('dashboard');
        else if (shortcut.key === 'o') setActiveTab('orders');
        else if (shortcut.key === 'i') setActiveTab('inventory');
        else shortcut.action();
      }
    }))
  ];

  useKeyboardShortcuts(shortcuts);

  const handleSearch = (query: string) => {
    toast({
      title: "Search",
      description: `Searching for: ${query}`,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "inventory":
        return <Inventory />;
      case "recipes":
        return <Recipes />;
      case "reports":
        return <EmailReports />;
      case "admin":
        return <AdminLogin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <InstallPrompt />
      <Layout
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onSearch={handleSearch}
        notifications={3}
      >
        {renderContent()}
      </Layout>
      <FloatingActionButton />
    </>
  );
};

export default Index;

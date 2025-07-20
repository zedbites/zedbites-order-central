import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Orders from "@/components/Orders";
import Inventory from "@/components/Inventory";
import Recipes from "@/components/Recipes";
import AdminLogin from "@/components/AdminLogin";
import FloatingActionButton from "@/components/layout/FloatingActionButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ShortcutsDialog } from "@/components/ShortcutsDialog";
import { useToast } from "@/hooks/use-toast";
import { useKeyboardShortcuts, defaultShortcuts } from "@/utils/KeyboardShortcuts";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

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
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Export sales and inventory reports</p>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Reports section coming soon...</p>
            </div>
          </div>
        );
      case "admin":
        return <AdminLogin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <InstallPrompt />
      <ShortcutsDialog />
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

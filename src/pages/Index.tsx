import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Orders from "@/components/Orders";
import Inventory from "@/components/Inventory";
import Recipes from "@/components/Recipes";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage meals, ingredients, and users</p>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Admin panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;

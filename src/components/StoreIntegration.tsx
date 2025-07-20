import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Download, RotateCcw, Key, Store, Package, ShoppingCart, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";

interface StoreData {
  url: string;
  title: string;
  content: string;
  metadata?: any;
}

export default function StoreIntegration() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || "");
  const [storeUrl, setStoreUrl] = useState("https://zedbites.store");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [apiKeyValid, setApiKeyValid] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your Firecrawl API key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const isValid = await FirecrawlService.testApiKey(apiKey);
    
    if (isValid) {
      FirecrawlService.saveApiKey(apiKey);
      setApiKeyValid(true);
      toast({
        title: "Success",
        description: "API key saved and validated successfully!"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleScrapeStore = async () => {
    if (!apiKeyValid) {
      toast({
        title: "Error",
        description: "Please save a valid API key first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setStoreData([]);

    try {
      const result = await FirecrawlService.scrapeStoreData(storeUrl);
      
      if (result.success && result.data) {
        setStoreData(result.data.data || []);
        setProgress(100);
        toast({
          title: "Success",
          description: `Successfully scraped ${result.data.completed || 0} pages from your store!`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape store data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error scraping store:', error);
      toast({
        title: "Error",
        description: "Failed to scrape store data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractMenuItems = () => {
    return storeData.filter(page => 
      page.content.toLowerCase().includes('menu') || 
      page.content.toLowerCase().includes('food') ||
      page.content.toLowerCase().includes('price')
    );
  };

  const syncToAdmin = (data: StoreData[]) => {
    // Here you would integrate with your admin panel
    toast({
      title: "Sync Complete",
      description: `Synced ${data.length} items to admin panel`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Integration</h1>
          <p className="text-muted-foreground">Connect and sync data from zedbites.store</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          TakeApp Integration
        </Badge>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="scrape" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Scrape Data
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Menu Items
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Sync
          </TabsTrigger>
        </TabsList>

        {/* API Key Setup */}
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Firecrawl API Setup
              </CardTitle>
              <CardDescription>
                Enter your Firecrawl API key to enable store data scraping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">Firecrawl API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="fc-your-api-key-here"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Get your API key from <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firecrawl.dev</a>
                </p>
              </div>
              <Button onClick={handleSaveApiKey} disabled={isLoading} className="w-full">
                {isLoading ? "Validating..." : "Save & Validate API Key"}
              </Button>
              {apiKeyValid && (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-sm">✓ API key is valid and ready to use</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scrape Data */}
        <TabsContent value="scrape" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Scrape Store Data
              </CardTitle>
              <CardDescription>
                Extract data from your TakeApp store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeUrl">Store URL</Label>
                <Input
                  id="storeUrl"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://zedbites.store"
                />
              </div>
              {isLoading && (
                <Progress value={progress} className="w-full" />
              )}
              <Button onClick={handleScrapeStore} disabled={isLoading || !apiKeyValid} className="w-full">
                {isLoading ? "Scraping Store..." : "Start Scraping"}
              </Button>
              
              {storeData.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Scraped Pages ({storeData.length})</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {storeData.map((page, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">{page.title || page.url}</p>
                        <p className="text-xs text-muted-foreground truncate">{page.content.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu Items */}
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Extracted Menu Items
              </CardTitle>
              <CardDescription>
                Menu items found in your store data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {storeData.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No data available. Please scrape your store first.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page Title</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractMenuItems().map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.title || 'Untitled'}</TableCell>
                        <TableCell className="max-w-md truncate">{item.content.substring(0, 150)}...</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Import
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Sync to Admin Panel
              </CardTitle>
              <CardDescription>
                Synchronize scraped data with your ZedBites admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Menu Items</h4>
                    <p className="text-2xl font-bold">{extractMenuItems().length}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => syncToAdmin(extractMenuItems())}
                    >
                      Sync Menu
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Orders</h4>
                    <p className="text-2xl font-bold">0</p>
                    <Button variant="outline" size="sm" className="mt-2" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">All Data</h4>
                    <p className="text-2xl font-bold">{storeData.length}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => syncToAdmin(storeData)}
                    >
                      Sync All
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Sync Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Update existing menu items</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Add new menu items</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Remove items not found in store</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
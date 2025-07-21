import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, 
  Plus, 
  Trash2, 
  Power, 
  PowerOff, 
  Calendar,
  Clock,
  Send,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface EmailSetting {
  id: string;
  email_type: 'daily_data' | 'weekly_report';
  recipient_email: string;
  recipient_name?: string;
  is_active: boolean;
  created_at: string;
}

interface EmailLog {
  id: string;
  email_type: string;
  recipient_email: string;
  subject: string;
  status: 'success' | 'failed';
  error_message?: string;
  sent_at: string;
}

const EmailReports = () => {
  const [recipients, setRecipients] = useState<EmailSetting[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  
  // Form state
  const [newRecipient, setNewRecipient] = useState({
    email_type: 'daily_data' as 'daily_data' | 'weekly_report',
    recipient_email: '',
    recipient_name: '',
  });

  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load recipients and logs
      const [recipientsResponse, logsResponse] = await Promise.all([
        supabase.functions.invoke('email-management/recipients'),
        supabase.functions.invoke('email-management/logs')
      ]);

      if (recipientsResponse.error) throw recipientsResponse.error;
      if (logsResponse.error) throw logsResponse.error;

      setRecipients(recipientsResponse.data || []);
      setLogs(logsResponse.data || []);
    } catch (error: any) {
      console.error('Error loading email data:', error);
      toast({
        title: "Error",
        description: "Failed to load email settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRecipient.recipient_email) {
      toast({
        title: "Error",
        description: "Email address is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAdding(true);
      
      const { data, error } = await supabase.functions.invoke('email-management/recipients', {
        method: 'POST',
        body: newRecipient
      });

      if (error) throw error;

      setRecipients([...recipients, data]);
      setNewRecipient({
        email_type: 'daily_data',
        recipient_email: '',
        recipient_name: '',
      });

      toast({
        title: "Success",
        description: "Email recipient added successfully.",
      });
    } catch (error: any) {
      console.error('Error adding recipient:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add recipient.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const toggleRecipient = async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('email-management/recipients', {
        method: 'PUT',
        body: { id, is_active: !isActive }
      });

      if (error) throw error;

      setRecipients(recipients.map(r => 
        r.id === id ? { ...r, is_active: !isActive } : r
      ));

      toast({
        title: "Success",
        description: `Recipient ${!isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error: any) {
      console.error('Error toggling recipient:', error);
      toast({
        title: "Error",
        description: "Failed to update recipient status.",
        variant: "destructive",
      });
    }
  };

  const deleteRecipient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipient?')) return;

    try {
      const { error } = await supabase.functions.invoke('email-management/recipients', {
        method: 'DELETE',
        body: { id }
      });

      if (error) throw error;

      setRecipients(recipients.filter(r => r.id !== id));

      toast({
        title: "Success",
        description: "Recipient deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting recipient:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipient.",
        variant: "destructive",
      });
    }
  };

  const testEmail = async (type: 'daily' | 'weekly') => {
    try {
      setTesting(type);
      
      const endpoint = type === 'daily' ? 'test-daily' : 'test-weekly';
      const { data, error } = await supabase.functions.invoke(`email-management/${endpoint}`, {
        method: 'POST'
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: `${type === 'daily' ? 'Daily' : 'Weekly'} report test completed. Check the logs below.`,
      });

      // Reload logs to show the test result
      await loadData();
    } catch (error: any) {
      console.error('Error testing email:', error);
      toast({
        title: "Error",
        description: `Failed to send test ${type} email.`,
        variant: "destructive",
      });
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const dailyRecipients = recipients.filter(r => r.email_type === 'daily_data');
  const weeklyRecipients = recipients.filter(r => r.email_type === 'weekly_report');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Reports</h1>
          <p className="text-muted-foreground">
            Manage automated daily and weekly email reports
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyRecipients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active: {dailyRecipients.filter(r => r.is_active).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyRecipients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active: {weeklyRecipients.filter(r => r.is_active).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">
              Success: {logs.filter(l => l.status === 'success').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Scheduled Times:</strong> Daily reports are sent every day at 00:00 UTC (midnight). 
          Weekly reports are sent every Saturday at 00:00 UTC.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="recipients" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recipients">Email Recipients</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
          <TabsTrigger value="test">Test Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="recipients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Recipient</CardTitle>
              <CardDescription>
                Add email addresses to receive automated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addRecipient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_type">Report Type</Label>
                    <Select
                      value={newRecipient.email_type}
                      onValueChange={(value: 'daily_data' | 'weekly_report') =>
                        setNewRecipient({ ...newRecipient, email_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily_data">Daily Data Capture</SelectItem>
                        <SelectItem value="weekly_report">Weekly Business Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient_email">Email Address</Label>
                    <Input
                      id="recipient_email"
                      type="email"
                      placeholder="manager@zedbites.com"
                      value={newRecipient.recipient_email}
                      onChange={(e) =>
                        setNewRecipient({ ...newRecipient, recipient_email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient_name">Name (Optional)</Label>
                    <Input
                      id="recipient_name"
                      placeholder="Manager Name"
                      value={newRecipient.recipient_name}
                      onChange={(e) =>
                        setNewRecipient({ ...newRecipient, recipient_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" disabled={adding}>
                  {adding ? <LoadingSpinner /> : <Plus className="h-4 w-4" />}
                  Add Recipient
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Recipients</CardTitle>
              <CardDescription>
                Manage who receives automated email reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recipients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No email recipients configured yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell>
                          <Badge variant={recipient.email_type === 'daily_data' ? 'default' : 'secondary'}>
                            {recipient.email_type === 'daily_data' ? 'Daily' : 'Weekly'}
                          </Badge>
                        </TableCell>
                        <TableCell>{recipient.recipient_email}</TableCell>
                        <TableCell>{recipient.recipient_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={recipient.is_active ? 'default' : 'secondary'}>
                            {recipient.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRecipient(recipient.id, recipient.is_active)}
                          >
                            {recipient.is_active ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRecipient(recipient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Delivery Logs</CardTitle>
              <CardDescription>
                Track the status of sent automated emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No email logs available yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant={log.email_type === 'daily_data' ? 'default' : 'secondary'}>
                            {log.email_type === 'daily_data' ? 'Daily' : 'Weekly'}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.recipient_email}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {log.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(log.sent_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Daily Report</CardTitle>
                <CardDescription>
                  Send a test daily data capture email to all active recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => testEmail('daily')}
                  disabled={testing === 'daily'}
                  className="w-full"
                >
                  {testing === 'daily' ? <LoadingSpinner /> : <Send className="h-4 w-4" />}
                  Send Test Daily Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Weekly Report</CardTitle>
                <CardDescription>
                  Send a test weekly business report to all active recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => testEmail('weekly')}
                  disabled={testing === 'weekly'}
                  className="w-full"
                >
                  {testing === 'weekly' ? <LoadingSpinner /> : <Send className="h-4 w-4" />}
                  Send Test Weekly Report
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Test emails will be sent immediately to all active recipients for the selected report type.
              Check the Email Logs tab to see the delivery status.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailReports;
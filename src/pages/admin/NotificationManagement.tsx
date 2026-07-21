import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Settings,
  Send,
  FileText,
  History,
  Mail,
  MessageSquare,
  Phone,
  Eye,
  EyeOff,
  TestTube,
  Save,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  Clock,
  AlertCircle,
  Users,
  ChevronRight,
} from "lucide-react";

// Types
interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  useSsl: boolean;
  status: "connected" | "not_configured" | "error";
}

interface SmsSettings {
  provider: string;
  apiKey: string;
  apiSecret: string;
  senderId: string;
  countryCode: string;
  status: "connected" | "not_configured" | "error";
}

interface WhatsAppSettings {
  provider: string;
  apiKey: string;
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  webhookUrl: string;
  status: "connected" | "not_configured" | "error";
}

interface NotificationTemplate {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  subject: string;
  content: string;
  category: string;
  isActive: boolean;
}

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  channel: "email" | "sms" | "whatsapp";
  targetAudience: string;
  recipientsCount: number;
  sentCount: number;
  failedCount: number;
  status: "draft" | "sending" | "completed" | "failed" | "partial";
  createdAt: string;
  sentAt: string;
}

const NotificationManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const tabs = [
    {
      value: "notificationSettings",
      label: "Settings",
      screenType: "NotificationSettin",
      icon: Settings,
    },
    {
      value: "notificationSend",
      label: "Send Notification",
      screenType: "NotificationSend",
      icon: Send,
    },
    {
      value: "notificationTemplates",
      label: "Templates",
      screenType: "NotificationTempla",
      icon: FileText,
    },
    {
      value: "notificationHistory",
      label: "History",
      screenType: "NotificationHistor",
      icon: History,
    },
  ];

  const [activeTab, setActiveTab] = useState("");

  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  const allowedScreens = permissions.map((p: any) => p.screen_type);

  const allowedTabs = tabs.filter((tab) =>
    allowedScreens.includes(tab.screenType),
  );

  useEffect(() => {
    if (allowedTabs.length > 0) {
      setActiveTab(allowedTabs[0].value);
    }
  }, []);

  const tabPermissions = [
    "NotificationSettin",
    "NotificationSend",
    "NotificationTempla",
    "NotificationHistor",
  ];

  const hasAnyTabPermission = tabPermissions.some((tab) =>
    allowedScreens.includes(tab),
  );

  if (!hasAnyTabPermission) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-gray-300">404</h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            No Permission Available
          </h2>

          <p className="mt-2 text-gray-500">
            You don't have permission to access any module in Notification Management.
          </p>

          <Button className="mt-6" onClick={() => navigate("/AdminDashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Settings state
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "gym@ruwfitness.com",
    smtpPassword: "",
    fromEmail: "noreply@ruwfitness.com",
    fromName: "RUW Fitness",
    useSsl: true,
    status: "connected",
  });

  const [smsSettings, setSmsSettings] = useState<SmsSettings>({
    provider: "unifonic",
    apiKey: "",
    apiSecret: "",
    senderId: "RUWGYM",
    countryCode: "+973",
    status: "connected",
  });

  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>({
    provider: "whatsapp_business",
    apiKey: "",
    phoneNumberId: "",
    accessToken: "",
    businessAccountId: "",
    webhookUrl: "https://api.ruwfitness.com/webhook/whatsapp",
    status: "connected",
  });

  // Password visibility
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {},
  );

  // Send Notification state
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["email"]);
  const [targetAudience, setTargetAudience] = useState("all");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Templates state
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Welcome Message",
      channel: "email",
      subject: "Welcome to RUW Fitness, {{name}}!",
      content:
        "Dear {{name}}, Welcome to RUW Fitness! Your membership is now active and we are excited to have you on board.",
      category: "welcome",
      isActive: true,
    },
    {
      id: "2",
      name: "Expiry Reminder",
      channel: "sms",
      subject: "",
      content:
        "Hi {{name}}, your gym membership expires on {{expiry_date}}. Renew now to continue enjoying our facilities!",
      category: "reminder",
      isActive: true,
    },
    {
      id: "3",
      name: "Special Offer",
      channel: "whatsapp",
      subject: "",
      content:
        "Hi {{name}}! Exclusive offer: Get 20% off on plan renewals. Use code RENEW20. Valid until {{offer_expiry}}.",
      category: "promotion",
      isActive: true,
    },
    {
      id: "4",
      name: "Payment Confirmation",
      channel: "email",
      subject: "Payment Received - RUW Fitness",
      content: "Dear {{name}}, Your payment of {{amount}} has been received. Thank you for your continued membership.",
      // content: "Dear {{name}}, Your payment of BHD {{amount}} has been received. Thank you for your continued membership.",
      category: "alert",
      isActive: true,
    },
  ]);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<NotificationTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>(
    {
      name: "",
      channel: "email",
      subject: "",
      content: "",
      category: "welcome",
      isActive: true,
    },
  );

  // History state
  const [notificationHistory] = useState<NotificationHistory[]>([
    {
      id: "1",
      title: "January Promotion",
      message: "New year special discount...",
      channel: "whatsapp",
      targetAudience: "Promotional Opt-in",
      recipientsCount: 245,
      sentCount: 240,
      failedCount: 5,
      status: "completed",
      createdAt: "2024-01-15 10:00",
      sentAt: "2024-01-15 10:30",
    },
    {
      id: "2",
      title: "Membership Expiry Reminder",
      message: "Your membership expires...",
      channel: "sms",
      targetAudience: "Expiring Soon",
      recipientsCount: 32,
      sentCount: 32,
      failedCount: 0,
      status: "completed",
      createdAt: "2024-01-14 08:45",
      sentAt: "2024-01-14 09:00",
    },
    {
      id: "3",
      title: "Facility Maintenance Notice",
      message: "Pool maintenance scheduled...",
      channel: "email",
      targetAudience: "All Members",
      recipientsCount: 1234,
      sentCount: 1220,
      failedCount: 14,
      status: "partial",
      createdAt: "2024-01-10 14:00",
      sentAt: "2024-01-10 14:15",
    },
    {
      id: "4",
      title: "New Class Announcement",
      message: "Introducing Yoga sessions...",
      channel: "email",
      targetAudience: "Active Members",
      recipientsCount: 890,
      sentCount: 0,
      failedCount: 0,
      status: "draft",
      createdAt: "2024-01-16 09:00",
      sentAt: "",
    },
  ]);

  // Testing states
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSms, setTestingSms] = useState(false);
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);

  // Helper functions
  const togglePassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status: "connected" | "not_configured" | "error") => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "not_configured":
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Configured
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
    }
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "email":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Badge>
        );
      case "sms":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <MessageSquare className="h-3 w-3 mr-1" />
            SMS
          </Badge>
        );
      case "whatsapp":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <Phone className="h-3 w-3 mr-1" />
            WhatsApp
          </Badge>
        );
      default:
        return <Badge variant="secondary">{channel}</Badge>;
    }
  };

  const getNotificationStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "sending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Sending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Action handlers
  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTimeout(() => {
      setTestingEmail(false);
      toast({
        title: "Test Email Sent",
        description: "A test email has been sent to your configured address.",
      });
    }, 2000);
  };

  const handleTestSms = async () => {
    setTestingSms(true);
    setTimeout(() => {
      setTestingSms(false);
      toast({
        title: "Test SMS Sent",
        description: "A test SMS has been sent to the admin phone number.",
      });
    }, 2000);
  };

  const handleTestWhatsApp = async () => {
    setTestingWhatsApp(true);
    setTimeout(() => {
      setTestingWhatsApp(false);
      toast({
        title: "Test WhatsApp Sent",
        description: "A test WhatsApp message has been sent.",
      });
    }, 2000);
  };

  const handleSaveEmailSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Email SMTP settings have been updated.",
    });
  };

  const handleSaveSmsSettings = () => {
    toast({
      title: "Settings Saved",
      description: "SMS API settings have been updated.",
    });
  };

  const handleSaveWhatsAppSettings = () => {
    toast({
      title: "Settings Saved",
      description: "WhatsApp API settings have been updated.",
    });
  };

  const handleSendNotification = () => {
    if (!notificationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Notification Queued",
      description: `Notification will be sent via ${selectedChannels.join(", ")} to ${targetAudience} members.`,
    });
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id
            ? ({ ...editingTemplate, ...newTemplate } as NotificationTemplate)
            : t,
        ),
      );
      toast({
        title: "Template Updated",
        description: "Template has been updated successfully.",
      });
    } else {
      const newTemp: NotificationTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name || "",
        channel:
          (newTemplate.channel as "email" | "sms" | "whatsapp") || "email",
        subject: newTemplate.subject || "",
        content: newTemplate.content || "",
        category: newTemplate.category || "welcome",
        isActive: newTemplate.isActive ?? true,
      };
      setTemplates([...templates, newTemp]);
      toast({
        title: "Template Created",
        description: "New template has been created successfully.",
      });
    }
    setTemplateDialogOpen(false);
    setEditingTemplate(null);
    setNewTemplate({
      name: "",
      channel: "email",
      subject: "",
      content: "",
      category: "welcome",
      isActive: true,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "Template has been removed.",
    });
  };

  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const duplicate: NotificationTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
    };
    setTemplates([...templates, duplicate]);
    toast({
      title: "Template Duplicated",
      description: "Template has been duplicated successfully.",
    });
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    );
  };

  const getRecipientCount = () => {
    switch (targetAudience) {
      case "all":
        return 1234;
      case "active":
        return 890;
      case "inactive":
        return 344;
      case "promotional":
        return 567;
      case "notifications":
        return 789;
      case "expiring":
        return 45;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                onClick={() => navigate("/AdminDashboard")}
                className="flex items-center px-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Notification Management
              </h1>
            </div>
            <Badge variant="secondary" className="shrink-0">
              Admin
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="mb-4 w-full overflow-x-auto scrollbar-thin">
            <TabsList className=" inline-flex w-max min-w-full sm:grid sm:w-full sm:grid-cols-4">
              {allowedTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center whitespace-nowrap px-4 py-2 min-w-[160px] sm:min-w-0"
                  >
                    <Icon className="h-4 w-4 mr-2 shrink-0" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Settings Tab */}
          <TabsContent value="notificationSettings" className="space-y-6">
            {/* Email SMTP Configuration */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Email SMTP Configuration</CardTitle>
                      <CardDescription>
                        Configure your email server settings
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(emailSettings.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input
                      value={emailSettings.smtpHost}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpHost: e.target.value,
                        })
                      }
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Select
                      value={emailSettings.smtpPort}
                      onValueChange={(value) =>
                        setEmailSettings({ ...emailSettings, smtpPort: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="465">465 (SSL)</SelectItem>
                        <SelectItem value="587">587 (TLS)</SelectItem>
                        <SelectItem value="2525">2525</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input
                      value={emailSettings.smtpUsername}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpUsername: e.target.value,
                        })
                      }
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <div className="relative">
                      <Input
                        type={
                          showPasswords["emailPassword"] ? "text" : "password"
                        }
                        value={emailSettings.smtpPassword}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            smtpPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => togglePassword("emailPassword")}
                      >
                        {showPasswords["emailPassword"] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input
                      value={emailSettings.fromEmail}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          fromEmail: e.target.value,
                        })
                      }
                      placeholder="noreply@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From Display Name</Label>
                    <Input
                      value={emailSettings.fromName}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          fromName: e.target.value,
                        })
                      }
                      placeholder="RUW Fitness"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={emailSettings.useSsl}
                    onCheckedChange={(checked) =>
                      setEmailSettings({ ...emailSettings, useSsl: checked })
                    }
                  />
                  <Label>Use SSL/TLS</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleTestEmail}
                    disabled={testingEmail}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testingEmail ? "Testing..." : "Test Connection"}
                  </Button>
                  <Button onClick={handleSaveEmailSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SMS API Configuration */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>SMS API Configuration</CardTitle>
                      <CardDescription>
                        Configure your SMS gateway settings
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(smsSettings.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMS Provider</Label>
                    <Select
                      value={smsSettings.provider}
                      onValueChange={(value) =>
                        setSmsSettings({ ...smsSettings, provider: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="msg91">MSG91</SelectItem>
                        <SelectItem value="unifonic">Unifonic</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Country Code</Label>
                    <Select
                      value={smsSettings.countryCode}
                      onValueChange={(value) =>
                        setSmsSettings({ ...smsSettings, countryCode: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+973">+973 (Bahrain)</SelectItem>
                        <SelectItem value="+966">
                          +966 (Saudi Arabia)
                        </SelectItem>
                        <SelectItem value="+971">+971 (UAE)</SelectItem>
                        <SelectItem value="+968">+968 (Oman)</SelectItem>
                        <SelectItem value="+965">+965 (Kuwait)</SelectItem>
                        <SelectItem value="+974">+974 (Qatar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords["smsApiKey"] ? "text" : "password"}
                        value={smsSettings.apiKey}
                        onChange={(e) =>
                          setSmsSettings({
                            ...smsSettings,
                            apiKey: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => togglePassword("smsApiKey")}
                      >
                        {showPasswords["smsApiKey"] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <div className="relative">
                      <Input
                        type={
                          showPasswords["smsApiSecret"] ? "text" : "password"
                        }
                        value={smsSettings.apiSecret}
                        onChange={(e) =>
                          setSmsSettings({
                            ...smsSettings,
                            apiSecret: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => togglePassword("smsApiSecret")}
                      >
                        {showPasswords["smsApiSecret"] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sender ID / Number</Label>
                  <Input
                    value={smsSettings.senderId}
                    onChange={(e) =>
                      setSmsSettings({
                        ...smsSettings,
                        senderId: e.target.value,
                      })
                    }
                    placeholder="RUWGYM"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleTestSms}
                    disabled={testingSms}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testingSms ? "Testing..." : "Test SMS"}
                  </Button>
                  <Button onClick={handleSaveSmsSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp API Configuration */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle>WhatsApp API Configuration</CardTitle>
                      <CardDescription>
                        Configure your WhatsApp Business API settings
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(whatsAppSettings.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>WhatsApp Provider</Label>
                    <Select
                      value={whatsAppSettings.provider}
                      onValueChange={(value) =>
                        setWhatsAppSettings({
                          ...whatsAppSettings,
                          provider: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp_business">
                          WhatsApp Business API
                        </SelectItem>
                        <SelectItem value="twilio">Twilio WhatsApp</SelectItem>
                        <SelectItem value="360dialog">360dialog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number ID</Label>
                    <Input
                      value={whatsAppSettings.phoneNumberId}
                      onChange={(e) =>
                        setWhatsAppSettings({
                          ...whatsAppSettings,
                          phoneNumberId: e.target.value,
                        })
                      }
                      placeholder="Enter Phone Number ID"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Access Token</Label>
                    <div className="relative">
                      <Input
                        type={
                          showPasswords["whatsappToken"] ? "text" : "password"
                        }
                        value={whatsAppSettings.accessToken}
                        onChange={(e) =>
                          setWhatsAppSettings({
                            ...whatsAppSettings,
                            accessToken: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => togglePassword("whatsappToken")}
                      >
                        {showPasswords["whatsappToken"] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Business Account ID</Label>
                    <Input
                      value={whatsAppSettings.businessAccountId}
                      onChange={(e) =>
                        setWhatsAppSettings({
                          ...whatsAppSettings,
                          businessAccountId: e.target.value,
                        })
                      }
                      placeholder="Enter Business Account ID"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL (Read Only)</Label>
                  <Input
                    value={whatsAppSettings.webhookUrl}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleTestWhatsApp}
                    disabled={testingWhatsApp}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testingWhatsApp ? "Testing..." : "Test WhatsApp"}
                  </Button>
                  <Button onClick={handleSaveWhatsAppSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Send Notification Tab */}
          <TabsContent value="notificationSend" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Select Channel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">
                        1
                      </span>
                      Select Channel
                    </CardTitle>
                    <CardDescription>
                      Choose one or more communication channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button
                        variant={
                          selectedChannels.includes("email")
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleChannel("email")}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        variant={
                          selectedChannels.includes("sms")
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleChannel("sms")}
                        className="flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        SMS
                      </Button>
                      <Button
                        variant={
                          selectedChannels.includes("whatsapp")
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleChannel("whatsapp")}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Select Recipients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">
                        2
                      </span>
                      Select Recipients
                    </CardTitle>
                    <CardDescription>
                      Choose your target audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Select
                        value={targetAudience}
                        onValueChange={setTargetAudience}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="active">
                            Active Members Only
                          </SelectItem>
                          <SelectItem value="inactive">
                            Inactive Members
                          </SelectItem>
                          <SelectItem value="promotional">
                            Members Opted for Promotions
                          </SelectItem>
                          <SelectItem value="notifications">
                            Members Opted for Notifications
                          </SelectItem>
                          <SelectItem value="expiring">
                            Expiring Soon (within 30 days)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>{getRecipientCount()}</strong> members will
                        receive this notification
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3: Compose Message */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">
                        3
                      </span>
                      Compose Message
                    </CardTitle>
                    <CardDescription>
                      Write your notification content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Use Template (Optional)</Label>
                      <Select
                        value={selectedTemplate}
                        onValueChange={(value) => {
                          setSelectedTemplate(value);
                          const template = templates.find(
                            (t) => t.id === value,
                          );
                          if (template) {
                            setNotificationSubject(template.subject);
                            setNotificationMessage(template.content);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template..." />
                        </SelectTrigger>
                        <SelectContent>
                          {templates
                            .filter((t) => t.isActive)
                            .map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name} ({template.channel})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedChannels.includes("email") && (
                      <div className="space-y-2">
                        <Label>Subject Line</Label>
                        <Input
                          value={notificationSubject}
                          onChange={(e) =>
                            setNotificationSubject(e.target.value)
                          }
                          placeholder="Enter email subject..."
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        {notificationMessage.length} characters • Available
                        placeholders: {"{{name}}"}, {"{{cpr}}"},{" "}
                        {"{{expiry_date}}"}, {"{{plan_name}}"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">
                        4
                      </span>
                      Review & Send
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Channels
                        </span>
                        <div className="flex gap-1">
                          {selectedChannels.map((channel) =>
                            getChannelBadge(channel),
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Recipients
                        </span>
                        <span className="font-semibold">
                          {getRecipientCount()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Target
                        </span>
                        <span className="text-sm capitalize">
                          {targetAudience.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {notificationMessage && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Preview:
                        </p>
                        <p className="text-sm line-clamp-3">
                          {notificationMessage}
                        </p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSendNotification}
                      disabled={
                        selectedChannels.length === 0 ||
                        !notificationMessage.trim()
                      }
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="notificationTemplates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Notification Templates</CardTitle>
                    <CardDescription>
                      Manage your reusable message templates
                    </CardDescription>
                  </div>
                  <Dialog
                    open={templateDialogOpen}
                    onOpenChange={setTemplateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingTemplate(null);
                          setNewTemplate({
                            name: "",
                            channel: "email",
                            subject: "",
                            content: "",
                            category: "welcome",
                            isActive: true,
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingTemplate
                            ? "Edit Template"
                            : "Add New Template"}
                        </DialogTitle>
                        <DialogDescription>
                          Create a reusable notification template
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input
                              value={newTemplate.name}
                              onChange={(e) =>
                                setNewTemplate({
                                  ...newTemplate,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Welcome Message"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Channel</Label>
                            <Select
                              value={newTemplate.channel}
                              onValueChange={(value) =>
                                setNewTemplate({
                                  ...newTemplate,
                                  channel: value as
                                    | "email"
                                    | "sms"
                                    | "whatsapp",
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="whatsapp">
                                  WhatsApp
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                              value={newTemplate.category}
                              onValueChange={(value) =>
                                setNewTemplate({
                                  ...newTemplate,
                                  category: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="welcome">Welcome</SelectItem>
                                <SelectItem value="reminder">
                                  Reminder
                                </SelectItem>
                                <SelectItem value="promotion">
                                  Promotion
                                </SelectItem>
                                <SelectItem value="alert">Alert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={newTemplate.isActive}
                                onCheckedChange={(checked) =>
                                  setNewTemplate({
                                    ...newTemplate,
                                    isActive: checked,
                                  })
                                }
                              />
                              <Label>Active</Label>
                            </div>
                          </div>
                        </div>
                        {newTemplate.channel === "email" && (
                          <div className="space-y-2">
                            <Label>Subject Line</Label>
                            <Input
                              value={newTemplate.subject}
                              onChange={(e) =>
                                setNewTemplate({
                                  ...newTemplate,
                                  subject: e.target.value,
                                })
                              }
                              placeholder="Email subject..."
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={newTemplate.content}
                            onChange={(e) =>
                              setNewTemplate({
                                ...newTemplate,
                                content: e.target.value,
                              })
                            }
                            placeholder="Template content..."
                            rows={6}
                          />
                          <p className="text-xs text-muted-foreground">
                            Available placeholders: {"{{name}}"}, {"{{cpr}}"},{" "}
                            {"{{expiry_date}}"}, {"{{plan_name}}"},{" "}
                            {"{{amount}}"}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setTemplateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveTemplate}>
                          {editingTemplate
                            ? "Update Template"
                            : "Create Template"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>
                          {getChannelBadge(template.channel)}
                        </TableCell>
                        <TableCell className="capitalize">
                          {template.category}
                        </TableCell>
                        <TableCell>
                          {template.isActive ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTemplate(template);
                                setNewTemplate(template);
                                setTemplateDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateTemplate(template)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="notificationHistory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Notification History</CardTitle>
                    <CardDescription>
                      View all sent notifications and their delivery status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Sent/Failed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationHistory.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="text-sm">
                          {notification.sentAt || notification.createdAt}
                        </TableCell>
                        <TableCell className="font-medium">
                          {notification.title}
                        </TableCell>
                        <TableCell>
                          {getChannelBadge(notification.channel)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {notification.targetAudience}
                        </TableCell>
                        <TableCell>{notification.recipientsCount}</TableCell>
                        <TableCell>
                          <span className="text-green-600">
                            {notification.sentCount}
                          </span>
                          {" / "}
                          <span className="text-red-600">
                            {notification.failedCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getNotificationStatusBadge(notification.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NotificationManagement;

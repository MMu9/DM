import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Plus, FileText, Clock, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Home = () => {
  const navigate = useNavigate();

  // Mock data for recent documents
  const recentDocuments = [
    {
      id: "1",
      title: "Office Supplies PO",
      type: "Purchase Order",
      date: "2023-10-15",
      status: "Approved",
      user: { name: "John Doe", avatar: "JD" },
    },
    {
      id: "2",
      title: "Software Services",
      type: "Quotation",
      date: "2023-10-12",
      status: "Pending",
      user: { name: "Sarah Smith", avatar: "SS" },
    },
    {
      id: "3",
      title: "Annual Maintenance",
      type: "Sales Agreement",
      date: "2023-10-10",
      status: "Draft",
      user: { name: "Mike Johnson", avatar: "MJ" },
    },
    {
      id: "4",
      title: "Hardware Equipment",
      type: "Purchase Order",
      date: "2023-10-08",
      status: "Approved",
      user: { name: "Lisa Brown", avatar: "LB" },
    },
  ];

  // Mock data for pending approvals
  const pendingApprovals = [
    {
      id: "5",
      title: "IT Infrastructure",
      type: "Purchase Order",
      date: "2023-10-14",
      status: "Pending Approval",
      user: { name: "David Wilson", avatar: "DW" },
    },
    {
      id: "6",
      title: "Consulting Services",
      type: "Quotation",
      date: "2023-10-13",
      status: "Pending Approval",
      user: { name: "Emma Taylor", avatar: "ET" },
    },
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
      case "Pending Approval":
        return "secondary";
      case "Draft":
        return "outline";
      default:
        return "default";
    }
  };

  const handleCreateDocument = (type) => {
    navigate("/create-document", { state: { documentType: type } });
  };

  const handleLanguageToggle = (language) => {
    // Logic to toggle between English and Arabic would go here
    console.log(`Switching to ${language}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-xl font-semibold">
              Document Management System
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLanguageToggle("English")}
            >
              <Globe className="mr-2 h-4 w-4" />
              English
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLanguageToggle("Arabic")}
            >
              <Globe className="mr-2 h-4 w-4" />
              العربية
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Quick Access Buttons */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Create New Document</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleCreateDocument("purchase-order")}>
              <Plus className="mr-2 h-4 w-4" />
              Purchase Order
            </Button>
            <Button onClick={() => handleCreateDocument("quotation")}>
              <Plus className="mr-2 h-4 w-4" />
              Quotation
            </Button>
            <Button onClick={() => handleCreateDocument("sales-agreement")}>
              <Plus className="mr-2 h-4 w-4" />
              Sales Agreement
            </Button>
          </div>
        </section>

        {/* Document Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Recent Documents
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Pending Approvals
            </TabsTrigger>
          </TabsList>

          {/* Recent Documents Tab */}
          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentDocuments.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge
                        variant={
                          doc.type === "Purchase Order"
                            ? "default"
                            : doc.type === "Quotation"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {doc.type}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg">{doc.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(doc.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{doc.user.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {doc.user.name}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/document/${doc.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/document/${doc.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pendingApprovals.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge
                        variant={
                          doc.type === "Purchase Order"
                            ? "default"
                            : doc.type === "Quotation"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {doc.type}
                      </Badge>
                      <Badge variant="secondary">{doc.status}</Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg">{doc.title}</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(doc.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{doc.user.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {doc.user.name}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/document/${doc.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        console.log(`Approving document ${doc.id}`)
                      }
                    >
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;

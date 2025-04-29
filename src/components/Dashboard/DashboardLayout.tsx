import React, { useState } from "react";
import { Menu, Bell, Globe, ChevronDown, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentGrid from "./DocumentGrid";
import DocumentCreationWizard from "../Documents/DocumentCreationWizard";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps = {}) => {
  const [isCreateDocumentOpen, setIsCreateDocumentOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ar">("en");
  const [documentType, setDocumentType] = useState<
    "po" | "quotation" | "agreement"
  >("po");

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "ar" : "en");
    // In a real app, this would also change the document direction and translations
  };

  const handleCreateDocument = (type: "po" | "quotation" | "agreement") => {
    setDocumentType(type);
    setIsCreateDocumentOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-background"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 pt-4">
                  <Button variant="ghost" className="justify-start">
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Purchase Orders
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Quotations
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Sales Agreements
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Settings
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">DocManager</h1>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex text-sm font-medium">
                User
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-background p-4 h-[calc(100vh-64px)] sticky top-16">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Purchase Orders
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Quotations
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Sales Agreements
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your documents and track their status.
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={() => handleCreateDocument("po")}>
                <Plus className="mr-2 h-4 w-4" /> New PO
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCreateDocument("quotation")}
              >
                <Plus className="mr-2 h-4 w-4" /> New Quotation
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCreateDocument("agreement")}
              >
                <Plus className="mr-2 h-4 w-4" /> New Agreement
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-8"
              />
            </div>
          </div>

          {/* Document tabs */}
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Recent Documents</TabsTrigger>
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="all">All Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              <DocumentGrid
                documents={[
                  {
                    id: "1",
                    type: "Purchase Order",
                    number: "PO-2023-001",
                    date: "2023-06-15",
                    status: "Approved",
                  },
                  {
                    id: "2",
                    type: "Quotation",
                    number: "QT-2023-005",
                    date: "2023-06-10",
                    status: "Sent",
                  },
                  {
                    id: "3",
                    type: "Sales Agreement",
                    number: "SA-2023-002",
                    date: "2023-06-05",
                    status: "Draft",
                  },
                  {
                    id: "4",
                    type: "Purchase Order",
                    number: "PO-2023-002",
                    date: "2023-06-01",
                    status: "Pending",
                  },
                ]}
              />
            </TabsContent>
            <TabsContent value="pending">
              <DocumentGrid
                documents={[
                  {
                    id: "4",
                    type: "Purchase Order",
                    number: "PO-2023-002",
                    date: "2023-06-01",
                    status: "Pending",
                  },
                  {
                    id: "5",
                    type: "Quotation",
                    number: "QT-2023-006",
                    date: "2023-05-28",
                    status: "Pending",
                  },
                ]}
              />
            </TabsContent>
            <TabsContent value="all">
              <DocumentGrid
                documents={[
                  {
                    id: "1",
                    type: "Purchase Order",
                    number: "PO-2023-001",
                    date: "2023-06-15",
                    status: "Approved",
                  },
                  {
                    id: "2",
                    type: "Quotation",
                    number: "QT-2023-005",
                    date: "2023-06-10",
                    status: "Sent",
                  },
                  {
                    id: "3",
                    type: "Sales Agreement",
                    number: "SA-2023-002",
                    date: "2023-06-05",
                    status: "Draft",
                  },
                  {
                    id: "4",
                    type: "Purchase Order",
                    number: "PO-2023-002",
                    date: "2023-06-01",
                    status: "Pending",
                  },
                  {
                    id: "5",
                    type: "Quotation",
                    number: "QT-2023-006",
                    date: "2023-05-28",
                    status: "Pending",
                  },
                  {
                    id: "6",
                    type: "Sales Agreement",
                    number: "SA-2023-001",
                    date: "2023-05-20",
                    status: "Approved",
                  },
                ]}
              />
            </TabsContent>
          </Tabs>

          {/* Document creation wizard dialog */}
          {isCreateDocumentOpen && (
            <DocumentCreationWizard documentType={documentType} />
          )}

          {/* Render children if provided */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

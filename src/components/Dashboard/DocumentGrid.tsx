import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  title: string;
  type: "purchase_order" | "quotation" | "sales_agreement";
  date: string;
  status: "draft" | "pending" | "approved" | "rejected";
  reference: string;
  amount: number;
}

interface DocumentGridProps {
  recentDocuments?: Document[];
  pendingApprovals?: Document[];
}

const DocumentGrid = ({
  recentDocuments = [
    {
      id: "1",
      title: "Office Supplies PO",
      type: "purchase_order",
      date: "2023-06-15",
      status: "approved",
      reference: "PO-2023-001",
      amount: 1250.0,
    },
    {
      id: "2",
      title: "Software License Quotation",
      type: "quotation",
      date: "2023-06-10",
      status: "pending",
      reference: "QT-2023-015",
      amount: 5000.0,
    },
    {
      id: "3",
      title: "Consulting Services Agreement",
      type: "sales_agreement",
      date: "2023-06-05",
      status: "draft",
      reference: "SA-2023-008",
      amount: 12000.0,
    },
    {
      id: "4",
      title: "Hardware Purchase",
      type: "purchase_order",
      date: "2023-06-01",
      status: "rejected",
      reference: "PO-2023-002",
      amount: 3750.0,
    },
  ],
  pendingApprovals = [
    {
      id: "5",
      title: "Marketing Services Quotation",
      type: "quotation",
      date: "2023-06-12",
      status: "pending",
      reference: "QT-2023-016",
      amount: 8500.0,
    },
    {
      id: "6",
      title: "IT Equipment Purchase",
      type: "purchase_order",
      date: "2023-06-14",
      status: "pending",
      reference: "PO-2023-003",
      amount: 6200.0,
    },
  ],
}: DocumentGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Status badge color mapping
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  // Document type display mapping
  const getDocumentTypeDisplay = (type: string) => {
    switch (type) {
      case "purchase_order":
        return "Purchase Order";
      case "quotation":
        return "Quotation";
      case "sales_agreement":
        return "Sales Agreement";
      default:
        return type;
    }
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Document Management</h2>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="purchase_order">Purchase Orders</SelectItem>
                <SelectItem value="quotation">Quotations</SelectItem>
                <SelectItem value="sales_agreement">
                  Sales Agreements
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount_high">
                  Amount (High to Low)
                </SelectItem>
                <SelectItem value="amount_low">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Document Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent Documents</TabsTrigger>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          </TabsList>

          {/* Recent Documents Tab */}
          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDocuments.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg truncate">
                        {doc.title}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(doc.status)}>
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">
                          {getDocumentTypeDisplay(doc.type)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Reference:
                        </span>
                        <span className="font-medium">{doc.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{doc.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">
                          ${doc.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex justify-between pt-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingApprovals.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden border-l-4 border-l-amber-500"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg truncate">
                        {doc.title}
                      </CardTitle>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">
                          {getDocumentTypeDisplay(doc.type)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Reference:
                        </span>
                        <span className="font-medium">{doc.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{doc.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">
                          ${doc.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex justify-between pt-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm">
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentGrid;

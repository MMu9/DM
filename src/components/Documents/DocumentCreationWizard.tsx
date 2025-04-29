import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  ChevronRight,
  FileText,
  Loader2,
  Package,
  Receipt,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface DocumentCreationWizardProps {
  documentType?:
    | "po"
    | "quotation"
    | "agreement"
    | "purchase-order"
    | "sales-agreement";
  onComplete?: (data: any) => void;
  onCancel?: () => void;
}

const basicInfoSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  reference: z.string().min(2, { message: "Reference number is required" }),
  date: z.string(),
  clientName: z.string().min(2, { message: "Client name is required" }),
  clientEmail: z.string().email({ message: "Please enter a valid email" }),
  clientPhone: z.string().optional(),
});

const itemSchema = z.object({
  name: z.string().min(2, { message: "Item name is required" }),
  description: z.string().optional(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.number().min(0, { message: "Price cannot be negative" }),
});

const itemsSchema = z.object({
  items: z
    .array(itemSchema)
    .min(1, { message: "At least one item is required" }),
});

const termsSchema = z.object({
  paymentTerms: z.string().min(3, { message: "Payment terms are required" }),
  deliveryTerms: z.string().optional(),
  additionalNotes: z.string().optional(),
});

const templateSchema = z.object({
  template: z.string(),
});

const DocumentCreationWizard: React.FC<DocumentCreationWizardProps> = ({
  documentType = "purchase-order",
  onComplete = () => {},
  onCancel = () => {},
}) => {
  // Normalize document type to handle both formats
  const normalizedDocType =
    documentType === "po"
      ? "purchase-order"
      : documentType === "agreement"
        ? "sales-agreement"
        : documentType;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: "Basic Information", icon: <FileText className="h-5 w-5" /> },
    { title: "Item Selection", icon: <Package className="h-5 w-5" /> },
    { title: "Terms & Conditions", icon: <Receipt className="h-5 w-5" /> },
    { title: "Template Selection", icon: <FileText className="h-5 w-5" /> },
  ];

  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      reference: `${normalizedDocType.toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split("T")[0],
      clientName: "",
      clientEmail: "",
      clientPhone: "",
    },
  });

  const itemsForm = useForm<z.infer<typeof itemsSchema>>({
    resolver: zodResolver(itemsSchema),
    defaultValues: {
      items: [{ name: "", description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const termsForm = useForm<z.infer<typeof termsSchema>>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      paymentTerms: "Payment due within 30 days of invoice",
      deliveryTerms: "",
      additionalNotes: "",
    },
  });

  const templateForm = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      template: "standard",
    },
  });

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await basicInfoForm.trigger();
        if (isValid) {
          setFormData({ ...formData, ...basicInfoForm.getValues() });
          setCurrentStep(currentStep + 1);
        }
        break;
      case 1:
        isValid = await itemsForm.trigger();
        if (isValid) {
          setFormData({ ...formData, ...itemsForm.getValues() });
          setCurrentStep(currentStep + 1);
        }
        break;
      case 2:
        isValid = await termsForm.trigger();
        if (isValid) {
          setFormData({ ...formData, ...termsForm.getValues() });
          setCurrentStep(currentStep + 1);
        }
        break;
      case 3:
        isValid = await templateForm.trigger();
        if (isValid) {
          setFormData({ ...formData, ...templateForm.getValues() });
          handleSubmit();
        }
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Combine all form data
      const finalData = {
        ...formData,
        ...templateForm.getValues(),
        documentType: normalizedDocType,
        createdAt: new Date().toISOString(),
      };

      // Here you would typically send the data to your backend
      console.log("Submitting document:", finalData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onComplete(finalData);
    } catch (error) {
      console.error("Error submitting document:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    const currentItems = itemsForm.getValues().items || [];
    itemsForm.setValue("items", [
      ...currentItems,
      { name: "", description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = itemsForm.getValues().items;
    if (currentItems.length > 1) {
      itemsForm.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      );
    }
  };

  const getDocumentTypeTitle = () => {
    switch (normalizedDocType) {
      case "purchase-order":
        return "Purchase Order";
      case "quotation":
        return "Quotation";
      case "sales-agreement":
        return "Sales Agreement";
      default:
        return "Document";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form {...basicInfoForm}>
            <form className="space-y-4">
              <FormField
                control={basicInfoForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={basicInfoForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4" />
              <h3 className="text-lg font-medium">Client Information</h3>
              <FormField
                control={basicInfoForm.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="client@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={basicInfoForm.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
      case 1:
        return (
          <Form {...itemsForm}>
            <form className="space-y-4">
              {itemsForm.getValues().items.map((_, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Item {index + 1}
                      </CardTitle>
                      {itemsForm.getValues().items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={itemsForm.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Product or service name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemsForm.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide details about this item"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={itemsForm.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={itemsForm.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full"
              >
                Add Another Item
              </Button>
            </form>
          </Form>
        );
      case 2:
        return (
          <Form {...termsForm}>
            <form className="space-y-4">
              <FormField
                control={termsForm.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Specify payment terms and conditions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={termsForm.control}
                name="deliveryTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Terms (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Specify delivery terms and conditions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={termsForm.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information or special instructions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      case 3:
        return (
          <Form {...templateForm}>
            <form className="space-y-4">
              <FormField
                control={templateForm.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Template</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard Template
                          </SelectItem>
                          <SelectItem value="professional">
                            Professional Template
                          </SelectItem>
                          <SelectItem value="minimal">
                            Minimal Template
                          </SelectItem>
                          <SelectItem value="detailed">
                            Detailed Template
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose a template for your{" "}
                      {getDocumentTypeTitle().toLowerCase()}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className="border rounded-md p-6 bg-muted/30">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {formData.title || "Document Title"}
                      </h2>
                      <p className="text-muted-foreground">
                        Ref: {formData.reference || "REF-0000"}
                      </p>
                      <p className="text-muted-foreground">
                        Date: {formData.date || "YYYY-MM-DD"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Client: {formData.clientName || "Client Name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.clientEmail || "client@example.com"}
                      </p>
                      {formData.clientPhone && (
                        <p className="text-sm text-muted-foreground">
                          {formData.clientPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-2 text-left">Item</th>
                            <th className="p-2 text-left">Qty</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(formData.items || []).map(
                            (item: any, i: number) => (
                              <tr key={i} className="border-t">
                                <td className="p-2">
                                  <div>{item.name || "Item name"}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.description}
                                  </div>
                                </td>
                                <td className="p-2">{item.quantity || 0}</td>
                                <td className="p-2">
                                  ${item.unitPrice?.toFixed(2) || "0.00"}
                                </td>
                                <td className="p-2">
                                  $
                                  {(
                                    (item.quantity || 0) * (item.unitPrice || 0)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                        <tfoot className="bg-muted/50">
                          <tr>
                            <td
                              colSpan={3}
                              className="p-2 text-right font-medium"
                            >
                              Total:
                            </td>
                            <td className="p-2 font-medium">
                              $
                              {(formData.items || [])
                                .reduce(
                                  (sum: number, item: any) =>
                                    sum +
                                    (item.quantity || 0) *
                                      (item.unitPrice || 0),
                                  0,
                                )
                                .toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Terms & Conditions</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Payment Terms:</strong>{" "}
                        {formData.paymentTerms || "Not specified"}
                      </p>
                      {formData.deliveryTerms && (
                        <p>
                          <strong>Delivery Terms:</strong>{" "}
                          {formData.deliveryTerms}
                        </p>
                      )}
                      {formData.additionalNotes && (
                        <p>
                          <strong>Additional Notes:</strong>{" "}
                          {formData.additionalNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background p-4 md:p-6 rounded-lg border shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Create {getDocumentTypeTitle()}
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete the form below to create a new{" "}
          {getDocumentTypeTitle().toLowerCase()}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index === currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : index < currentStep
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 hidden md:block ${index === currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-muted mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        {renderStepContent()}
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handleBack}
          disabled={isSubmitting}
        >
          {currentStep === 0 ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === steps.length - 1 ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Document
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentCreationWizard;

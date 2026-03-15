"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1
  name: string;
  category: string;
  country: string;
  website: string;
  // Step 2
  dataAccess: string;
  financialExposure: string;
  operationalDependency: string;
}

const steps = [
  { number: 1, title: "Basic Info" },
  { number: 2, title: "Risk Classification" },
  { number: 3, title: "Review & Submit" },
];

const categories = ["IT/Cloud", "Logistics", "Legal", "Finance", "Manufacturing"];
const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Japan",
  "Singapore",
  "Switzerland",
  "Netherlands",
  "Ireland",
  "China",
];

export function AddVendorDialog({ open, onOpenChange }: AddVendorDialogProps) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    country: "",
    website: "",
    dataAccess: "",
    financialExposure: "",
    operationalDependency: "",
  });

  const handleClose = () => {
    setStep(1);
    setFormData({
      name: "",
      category: "",
      country: "",
      website: "",
      dataAccess: "",
      financialExposure: "",
      operationalDependency: "",
    });
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    console.log("Submitting vendor:", formData);
    handleClose();
  };

  const isStep1Valid = formData.name && formData.category && formData.country;
  const isStep2Valid =
    formData.dataAccess &&
    formData.financialExposure &&
    formData.operationalDependency;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>
            Complete the vendor intake form to add a new third-party vendor.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    step >= s.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s.number ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    s.number
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm hidden sm:inline",
                    step >= s.number
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-12 h-px mx-2",
                    step > s.number ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vendor Name</Label>
                <Input
                  id="name"
                  placeholder="Enter vendor name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataAccess">Data Access Level</Label>
                <Select
                  value={formData.dataAccess}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dataAccess: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select data access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                    <SelectItem value="Sensitive">Sensitive</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Level of access to company/customer data
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="financialExposure">Financial Exposure</Label>
                <Select
                  value={formData.financialExposure}
                  onValueChange={(value) =>
                    setFormData({ ...formData, financialExposure: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select financial exposure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Financial risk if vendor fails to deliver
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationalDependency">
                  Operational Dependency
                </Label>
                <Select
                  value={formData.operationalDependency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, operationalDependency: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select operational dependency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Business impact if vendor services are disrupted
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please review the information before submitting.
              </p>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Vendor Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {formData.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium text-foreground">
                      {formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="text-sm font-medium text-foreground">
                      {formData.country}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <p className="text-sm font-medium text-foreground">
                    {formData.website || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <p className="text-xs font-medium text-foreground uppercase tracking-wider">
                  Risk Classification
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Data Access</p>
                    <p className="text-sm font-medium text-foreground">
                      {formData.dataAccess}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Financial Exposure
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formData.financialExposure}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Op. Dependency
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formData.operationalDependency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Vendor</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

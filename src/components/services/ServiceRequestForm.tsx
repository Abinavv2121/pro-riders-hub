
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Camera, FileText, Upload, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

interface ServiceRequestFormProps {
  onSubmit?: (data: ServiceRequestData) => void;
  loading?: boolean;
}

export interface ServiceRequestData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  problemDescription: string;
  bikePhotos: File[];
  invoice: File | null;
  bikeModel?: string;
  bikeBrand?: string;
}

const ServiceRequestForm = ({ onSubmit, loading }: ServiceRequestFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [bikePhotos, setBikePhotos] = useState<File[]>([]);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [bikeModel, setBikeModel] = useState("");
  const [bikeBrand, setBikeBrand] = useState("");
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const invoiceInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setBikePhotos((prev) => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoice(e.target.files[0]);
    }
  };

  const removePhoto = (index: number) => {
    setBikePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeInvoice = () => {
    setInvoice(null);
    if (invoiceInputRef.current) {
      invoiceInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !problemDescription.trim()) {
      alert("Please fill in your Name, Email, Phone, and Describe the Problem.");
      return;
    }
    const data: ServiceRequestData = {
      customerName,
      customerEmail,
      customerPhone,
      problemDescription,
      bikePhotos,
      invoice,
      bikeModel,
      bikeBrand,
    };
    onSubmit?.(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Service Request Details
        </CardTitle>
        <CardDescription>Provide details about your bike and the service you need</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4 border-b pb-4 border-muted">
          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name *</Label>
            <Input
              id="customerName"
              placeholder="e.g., John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="e.g., john@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="e.g., +91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Bike Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bikeBrand">Bike Brand</Label>
            <Input
              id="bikeBrand"
              placeholder="e.g., Trek, Scott, Giant"
              value={bikeBrand}
              onChange={(e) => setBikeBrand(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bikeModel">Bike Model</Label>
            <Input
              id="bikeModel"
              placeholder="e.g., Marlin 5, Addict RC"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-2">
          <Label htmlFor="problemDescription">Describe the Problem</Label>
          <Textarea
            id="problemDescription"
            placeholder="Please describe the issue with your bike in detail..."
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            rows={4}
            disabled={loading}
            className="text-black"
          />
          <p className="text-xs text-muted-foreground">
            {problemDescription.length}/500 characters
          </p>
        </div>

        {/* Bike Photos Upload */}
        <div className="space-y-2">
          <Label>Upload Bike Photos (Max 5)</Label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {bikePhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Bike photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  disabled={loading}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            {bikePhotos.length < 5 && (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={loading}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Photo</span>
              </button>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={loading}
          />
        </div>

        {/* Invoice Upload */}
        <div className="space-y-2">
          <Label>Upload Purchase Invoice (Optional)</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            {invoice ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">{invoice.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(invoice.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeInvoice}
                  disabled={loading}
                  className="ml-4 text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => invoiceInputRef.current?.click()}
                disabled={loading}
                className="flex flex-col items-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload invoice
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, JPG, PNG up to 10MB
                </span>
              </button>
            )}
          </div>
          <input
            ref={invoiceInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleInvoiceUpload}
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {loading ? "Submitting Request..." : "Submit Service Request"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestForm;


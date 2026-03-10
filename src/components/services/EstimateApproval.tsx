
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, CheckCircle, MessageSquare, X, XCircle } from "lucide-react";
import { useState } from "react";

interface EstimateApprovalProps {
  estimatedCost: number;
  onApprove?: () => void;
  onRequestChanges?: (message: string) => void;
}

const EstimateApproval = ({ estimatedCost, onApprove, onRequestChanges }: EstimateApprovalProps) => {
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [changeMessage, setChangeMessage] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "changes-requested">("pending");

  const handleApprove = () => {
    setStatus("approved");
    onApprove?.();
  };

  const handleRequestChanges = () => {
    if (changeMessage.trim()) {
      setStatus("changes-requested");
      onRequestChanges?.(changeMessage);
      setShowChangeRequest(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Service Estimate
        </CardTitle>
        <CardDescription>Please review and approve the estimated cost for your service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estimated Cost Display */}
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Estimated Cost</p>
          <motion.p
            className="font-heading text-4xl font-bold text-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ₹{estimatedCost.toLocaleString("en-IN")}
          </motion.p>
          <p className="text-xs text-muted-foreground mt-2">
            Final cost may vary based on actual work required
          </p>
        </div>

        {/* Status Display */}
        <AnimatePresence mode="wait">
          {status === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center"
            >
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-green-600">Estimate Approved!</p>
              <p className="text-sm text-muted-foreground">We'll proceed with the service</p>
            </motion.div>
          )}

          {status === "changes-requested" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center"
            >
              <MessageSquare className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium text-yellow-600">Changes Requested</p>
              <p className="text-sm text-muted-foreground">We'll review your feedback</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Change Request Form */}
        <AnimatePresence>
          {showChangeRequest && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Please describe the changes or concerns you have..."
                value={changeMessage}
                onChange={(e) => setChangeMessage(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowChangeRequest(false);
                    setChangeMessage("");
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleRequestChanges}
                  disabled={!changeMessage.trim()}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {!showChangeRequest && status === "pending" && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowChangeRequest(true)}
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
            <Button onClick={handleApprove}>
              <Check className="w-4 h-4 mr-2" />
              Approve Service
            </Button>
          </div>
        )}

        {/* Info Note */}
        <div className="text-xs text-muted-foreground text-center">
          <p>By approving, you authorize us to proceed with the service up to the estimated cost.</p>
          <p className="mt-1">We'll contact you if any additional work is required.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateApproval;


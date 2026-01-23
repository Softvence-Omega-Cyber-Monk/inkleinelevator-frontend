import { useEffect, useState } from "react";
import {
  useCheckConnectAccountActivationMutation,
  useGetOnboardingLinkMutation,
} from "@/Redux/features/ElevatorDa/stripe/stripeApi";
import { toast } from "sonner";

export default function UserStripeTab() {
  const [checkActivation, { isLoading: isChecking }] =
    useCheckConnectAccountActivationMutation();
  const [getOnboardingLink, { isLoading: isGettingLink }] =
    useGetOnboardingLinkMutation();

  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check activation status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const result = await checkActivation().unwrap();
        setStatus(result.data?.status || null);
      } catch (error: any) {
        console.error("Failed to check activation status:", error);
        toast.error(
          error?.data?.message || "Failed to check Stripe account status"
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [checkActivation]);

  // Handle activate button click
  const handleActivate = async () => {
    try {
      const result = await getOnboardingLink().unwrap();
      if (result.url) {
        // Redirect to Stripe onboarding link
        window.location.href = result.url;
      } else {
        toast.error("No onboarding link received");
      }
    } catch (error: any) {
      console.error("Failed to get onboarding link:", error);
      toast.error(
        error?.data?.message || "Failed to get Stripe onboarding link"
      );
    }
  };

  if (isLoading || isChecking) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Checking Stripe account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Stripe Account</h2>

      <div className="space-y-4">
        {status === "active" ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              Your Stripe account is active
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium mb-4">
              Your Stripe account is not active
            </p>
            <button
              onClick={handleActivate}
              disabled={isGettingLink}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGettingLink ? "Processing..." : "Activate Stripe Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

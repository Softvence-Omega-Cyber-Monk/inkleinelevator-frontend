import { useState } from "react";
import { X, CreditCard, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCreateSingleJobPaymentMutation } from "@/Redux/features/userDa/payment/paymentBidApi";
import { toast } from "sonner";

const stripePromise = loadStripe(
  "pk_test_51SoyhfCWJMfCZ4i8GjYjbILfFOjutP7T6KT27Kv9t2xWWZCdk53VXjGfKHtE1NrBRiKIJlwZBMDjv0oryK4KpDkf000BSkzJPZ",
);

interface PaymentConfirmModalProps {
  bid: any;
  job: any;
  onClose: () => void;
  onSuccess: () => void;
  refetch?: () => void;
}

/* ================= PAYMENT FORM ================= */

function PaymentForm({
  bid,
  onClose,
  onSuccess,
  refetch,
}: PaymentConfirmModalProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [createSingleJobPayment] = useCreateSingleJobPaymentMutation();

  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const result = await createSingleJobPayment({
        amount: parseFloat(bid?.bidAmount),
        jobId: bid?.jobId,
        bidId: bid?.bidId,
      }).unwrap();

      const clientSecret = result?.data?.clientSecret;

      if (!clientSecret) {
        alert("Client secret not found");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        // alert("Payment Successful ✅");
        toast.success("Payment successful!");
        if (refetch) refetch();
        onClose();
        onSuccess();
      }
    } catch (error: any) {
      console.error(error);
      //   alert(error?.data?.message || "Payment failed");
      toast.success("Payment Payment failed!");
      //   onClose();
      onSuccess();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard size={24} />
            Complete Payment
          </h2>
          <button onClick={onClose} className="text-white">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">You are paying</p>
            <p className="text-4xl font-bold text-indigo-600">
              ${bid?.bidAmount}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {bid?.user?.companyName || bid?.user?.name}
            </p>
          </div>

          {/* Card Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Details
            </label>
            <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus-within:border-indigo-500 focus-within:bg-white transition">
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1f2937",
                      "::placeholder": { color: "#9ca3af" },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-4 py-3 border rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handlePayment}
              disabled={processing || !stripe}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing
                </>
              ) : (
                `Pay $${bid?.bidAmount}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN MODAL ================= */

export default function PaymentConfirmModal(props: PaymentConfirmModalProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}

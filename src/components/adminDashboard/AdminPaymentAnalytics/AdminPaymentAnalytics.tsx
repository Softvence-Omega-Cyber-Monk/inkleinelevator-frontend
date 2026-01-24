import { useGetAllAdminPaymentAnalyticsQuery } from "@/Redux/features/AdminDashboard/paymentApi";
import { Lock, User, Users, Wrench } from "lucide-react";

export default function AdminPaymentAnalytics() {
  const { data: paymentsData } = useGetAllAdminPaymentAnalyticsQuery({});
  console.log("iam the data for analitec", paymentsData);
  return (
    <div>
      {/* card here  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm text-gray-600">In Escrow</span>
            <div className="text-gray-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#D08700] mb-1">
            ${paymentsData?.data?.payments?.inEscrow}
          </div>
          {/* <div className="text-xs text-gray-500">4 payments pending</div> */}
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm text-gray-600">
              Platform Revenue
            </span>
            <div className="text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#00A63E] mb-1">
            ${paymentsData?.data?.payments?.totalPlatformRevenew}
          </div>
          {/* <div className="text-xs text-gray-500">
            10% commission from pending
          </div> */}
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm text-gray-600">
              To Be Released
            </span>
            <div className="text-gray-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#155DFC] mb-1">
            ${paymentsData?.data?.payments?.relesepayment?.constructorGet}
          </div>
          {/* <div className="text-xs text-gray-500">To contractors (90%)</div> */}
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm text-gray-600">
              Released Today
            </span>
            <div className="text-gray-400">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl  text-[#0A0A0A] mb-1">
            ${paymentsData?.data?.payments?.relesepayment?.totalRelesed}
          </div>
          {/* <div className="text-xs text-gray-500">2 payments processed</div> */}
        </div>
      </div>
    </div>
  );
}

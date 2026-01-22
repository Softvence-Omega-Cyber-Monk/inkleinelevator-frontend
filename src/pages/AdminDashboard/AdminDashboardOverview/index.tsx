import Analytics from "./Analytics";
import ContractorApproval from "./ContractorApproval";
import RecentActivity from "./RecentActivity";

const AdminDashboardOverview = () => {

  return (
    <div>
      <div className="flex items-center justify-between mb-6" >
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Full control center for managing users, jobs, and platform activity
          </p>
        </div>
      </div>
      <Analytics/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <ContractorApproval/>
        <RecentActivity/>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
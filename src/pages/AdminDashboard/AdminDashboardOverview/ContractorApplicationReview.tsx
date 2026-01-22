import formatToYMD from "@/utils/formatToYMD"
import { useVerifyUserStatusMutation } from "@/Redux/features/AdminDashboard/adminApi"

interface Data {
  userId: string;
  companyName?: string;
  email?: string;
  createdAt?: string;
  licenseInfo?: string;
  licenseNo?: string;
  // Add other properties as needed
}

interface Props {
  data: Data;
  close: () => void;
}

export default function ContractorApplicationReview({data, close}: Props) {
  const [verifyContractor, { isLoading }] = useVerifyUserStatusMutation();

  console.log(data);

  const handleVerify = async () => {
    console.log('handle_verify');
    try {
      const result = await verifyContractor({
        id: data.userId, 
        status: "VERIFID" 
      }).unwrap();
      
      console.log('Verification successful:', result);
      close();
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  return (
    <div className="fixed z-9999 w-full h-full top-0 left-0 bg-black/60 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] max-h-[648px] rounded-lg p-6 bg-white overflow-y-auto">
        <div className="space-y-[4px]">
          <h3 className="text-[18px] font-semibold">Contractor Application Review</h3>
          <p className="font-regular text-[14px] text-gray-400">Review license documents and verify contractor credentials</p>
        </div>

        <div className="mt-4 space-y-[12px]">
          <h3 className="font-semibold text-base ">Company Information</h3>
          <div className="bg-gray-100 rounded-xl">
            <ul className="p-5 space-y-[16px]">
              <li className="flex justify-between">
                <span>Contractor:</span> 
                <span className="font-semibold text-base">{data.companyName || 'Not provided'}</span>
              </li>

              <li className="flex justify-between">
                <span>Email:</span> 
                <span className="font-semibold text-base">{data.email || 'Not provided'}</span>
              </li>
              
              {data?.licenseNo && (
                <li className="flex justify-between">
                  <span>License Number:</span> 
                  <span className="font-semibold text-base">{data.licenseNo}</span>
                </li>
              )}
              
              {data?.createdAt && (
                <li className="flex justify-between">
                  <span>Applied:</span> 
                  <span className="font-semibold text-base">{formatToYMD(data.createdAt)}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-base">Documents</h3>
          <div className="space-y-3 mt-3">
            <div className="w-full rounded-lg border border-gray-200 p-5 flex items-center gap-4">
              <img className="h-8 w-8" src="/icons/blue_shild_icon.svg" alt="Document icon" />
              <div className="">
                <h4 className="font-semibold text-base">Elevator License Certificate</h4>
                <p className="text-xs font-normal">elevator_license.pdf • 2.4 MB</p>
              </div>
              {/* download button */}
              {data.licenseInfo && (
                <a 
                  className="ml-auto" 
                  href={data.licenseInfo} 
                  download="elevator_license.pdf"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img src="/icons/download_icon.svg" alt="Download" />
                </a>
              )}
            </div>

            <div className="w-full rounded-lg border border-gray-200 p-5 flex items-center gap-4">
              <img className="h-8 w-8" src="/icons/blue_shild_icon.svg" alt="Document icon" />
              <div className="">
                <h4 className="font-semibold text-base">Insurance Certificate</h4>
                <p className="text-xs font-normal">insurance_cert.pdf • 1.8 MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-5 flex-row-reverse">
          <button 
            className={`rounded-[6px] py-2 px-4 bg-black text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleVerify} 
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button 
            className="rounded-[6px] py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={close} 
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>

        <button 
          onClick={close} 
          disabled={isLoading}
          className="w-4 h-4 absolute top-[30px] right-[30px] disabled:opacity-50"
        >
          <img src="/icons/close_button.svg" alt="Close" />
        </button>
      </div>
    </div>
  )
}
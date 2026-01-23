/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetConstructorApprovalShortListQuery } from '@/Redux/features/AdminDashboard/adminApi'
import ContractorApplicationReview from './ContractorApplicationReview'
import { useState } from 'react'

// Define types for contractor data
interface Contractor {
  userId: string;
  companyName: string;
  email?: string;
  createdAt?: string;
  licenseInfo?: string;
  verifidStatus?: string;
  licenseNo?: string;
  [key: string]: any; // For any additional properties
}

interface ModalState {
  isOpen: boolean;
  data: Contractor;
}

interface ApiResponse {
  data: Contractor[];
  success?: boolean;
  message?: string;
  meta?: any;
}

export default function ContractorApproval() {
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        data: {
            userId: "",
            companyName: "",
            email: "",
            createdAt: "",
            licenseInfo: "",
            licenseNo: "",
            verifidStatus: ""
        }
    })

    function onReviewClick(data: Contractor) {
        setModal({
            isOpen: true,
            data: data
        })
    }
    
    function closeModal() {
        setModal({ 
            isOpen: false, 
            data: {
                userId: "",
                companyName: "",
                email: "",
                createdAt: "",
                licenseInfo: "",
                licenseNo: "",
                verifidStatus: ""
            }
        })
    }   

    const { 
        data: constructorApprovalList, 
        isLoading: isConstructorApprovalLoading, 
        isError: isConstructorApprovalError, 
        error: constructorApprovalError 
    } = useGetConstructorApprovalShortListQuery({})

    if(isConstructorApprovalLoading) {
        return (
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                <div className="mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-[#0A0A0A] mb-2">Contractor Approval</h2>
                    <p className="text-sm text-[#717182]">Items requiring immediate attention</p>
                </div>
                <div className="space-y-4">
                    {[1,2,3,4,5].map((_, index) => <SkeletonContractorRow key={index} />)}
                </div>
            </div>
        )
    }

    if(isConstructorApprovalError) {
        console.log(constructorApprovalError)
        return <div className="text-red-500 font-medium">Failed to load contractor approvals!</div>
    }

    // Type guard to check if data exists and has the expected structure
    if (!constructorApprovalList || !('data' in constructorApprovalList)) {
        return <div className="text-yellow-500 font-medium">No contractor data available</div>
    }

    // Type assertion with better check
    const approvalList = constructorApprovalList as ApiResponse;

    // Check if data array exists
    if (!approvalList.data || !Array.isArray(approvalList.data)) {
        return <div className="text-yellow-500 font-medium">Invalid contractor data format</div>
    }

    console.log(approvalList.data)
    return (
        <>
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0A0A0A] mb-2">
                    Contractor Approval
                </h2>
                <p className="text-sm text-[#717182]">
                    Items requiring immediate attention
                </p>
                </div>
                <div className="space-y-4">
                    {approvalList.data.map((job: Contractor, index: number) => (
                        <div
                        key={job.userId || `job-${index}`}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-0"
                        >
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm mb-1">
                            {job.companyName || 'Unnamed Company'}
                            </div>
                            <div className="text-xs text-gray-500">{job.verifidStatus || 'Pending'}</div>
                        </div>
                        <button 
                            onClick={() => onReviewClick(job)} 
                            className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-800"
                        >
                            Review
                        </button>
                        </div>  
                    ))}
                </div>
            </div>

            {modal.isOpen && (
                <ContractorApplicationReview 
                    key={modal.data.userId} 
                    data={modal.data} 
                    close={closeModal}
                />
            )}
        </>
    )
}

function SkeletonContractorRow() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-0 animate-pulse">
            <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded mt-2 sm:mt-0"></div>
        </div>
    )
}
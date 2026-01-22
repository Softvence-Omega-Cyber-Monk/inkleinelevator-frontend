import React from 'react'
import { useGetConstructorApprovalShortListQuery } from '@/Redux/features/AdminDashboard/adminApi'

export default function ContractorApproval() {

    const { data: constructorApprovalList, isLoading: isConstructorApprovalLoading, isError: isConstructorApprovalError, error: constructorApprovalError } = useGetConstructorApprovalShortListQuery()
    if(isConstructorApprovalLoading) {
        // show 5 skeleton rows
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

    return (
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
                {constructorApprovalList.data.map((job, index) => (
                    <div
                    key={job.userId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-0"
                    >
                    <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                        {job.companyName}
                        </div>
                        <div className="text-xs text-gray-500">{job.verifidStatus}</div>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-800">
                        Review
                    </button>
                    </div>  
                ))}
            </div>
        </div>
  )
}

function SkeletonContractorRow() {
    return (<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-0 animate-pulse">
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div> {/* company name */}
          <div className="h-3 bg-gray-200 rounded w-1/3"></div> {/* status */}
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded mt-2 sm:mt-0"></div> {/* button */}
      </div>)
}

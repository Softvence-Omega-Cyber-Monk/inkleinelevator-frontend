// import React, { useState } from "react";
// import { User, Briefcase } from "lucide-react";
// import HireSignupForm from "@/components/SignupFormComponent/HireSignupForm";
// import WorkSignupForm from "@/components/SignupFormComponent/WorkSignupForm";

// const Signup: React.FC = () => {
//   const [selectedOption, setSelectedOption] = useState<"hire" | "work" | null>(
//     null,
//   );

//   const [step, setStep] = useState<"select" | "form">("select");

//   const handleContinue = () => {
//     if (selectedOption) {
//       setStep("form");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex items-center justify-center min-h-screen px-8 py-12">
//         <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 ">
//           {/* ================= STEP 1 ================= */}
//           {step === "select" && (
//             <>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   Create an account
//                 </h1>
//                 <p className="text-gray-500 text-sm">
//                   Choose how you want to use the platform
//                 </p>
//               </div>

//               <div className="space-y-4 mb-8">
//                 <button
//                   onClick={() => setSelectedOption("hire")}
//                   className={`w-full p-5 rounded-xl border-2 transition-all text-left flex gap-4 ${
//                     selectedOption === "hire"
//                       ? "border-gray-900 bg-gray-50"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <User className="w-6 h-6" />
//                   <div>
//                     <p className="font-semibold">I want to hire</p>
//                     <p className="text-sm text-gray-500">
//                       Find and hire professionals
//                     </p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setSelectedOption("work")}
//                   className={`w-full p-5 rounded-xl border-2 transition-all text-left flex gap-4 ${
//                     selectedOption === "work"
//                       ? "border-gray-900 bg-gray-50"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <Briefcase className="w-6 h-6" />
//                   <div>
//                     <p className="font-semibold">I want to work</p>
//                     <p className="text-sm text-gray-500">
//                       Find jobs and grow your business
//                     </p>
//                   </div>
//                 </button>
//               </div>

//               <button
//                 onClick={handleContinue}
//                 disabled={!selectedOption}
//                 className={`w-full py-3 rounded-lg ${
//                   selectedOption
//                     ? "bg-gray-900 text-white"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Continue
//               </button>
//             </>
//           )}

//           {/* ================= STEP 2 ================= */}
//           {step === "form" && selectedOption === "hire" && <HireSignupForm />}

//           {step === "form" && selectedOption === "work" && <WorkSignupForm />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import { User, Briefcase, ArrowLeft } from "lucide-react";
import HireSignupForm from "@/components/SignupFormComponent/HireSignupForm";
import WorkSignupForm from "@/components/SignupFormComponent/WorkSignupForm";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<"hire" | "work" | null>(
    null,
  );
  const [step, setStep] = useState<"select" | "form">("select");

  const handleContinue = () => {
    if (selectedOption) {
      setStep("form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen ">
        {/* STEP 1 CARD (unchanged) */}
        {step === "select" && (
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10">
            {/* ================= STEP 1 ================= */}
            <div className=" mb-8">
              <div
                onClick={() => navigate("/")}
                className=" cursor-pointer hover:bg-gray-900 hover:text-white -mt-6  w-8 h-8 rounded-full flex justify-center items-center"
              >
                <ArrowLeft />
              </div>
              <h1 className="text-3xl text-center font-bold text-gray-900 mb-2">
                Create an account
              </h1>
              <p className="text-gray-500 text-sm text-center">
                Choose how you want to use the platform
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <button
                onClick={() => setSelectedOption("hire")}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left flex gap-4 ${
                  selectedOption === "hire"
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className="w-6 h-6" />
                <div>
                  <p className="font-semibold">I want to hire</p>
                  <p className="text-sm text-gray-500">
                    Find and hire professionals
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedOption("work")}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left flex gap-4 ${
                  selectedOption === "work"
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Briefcase className="w-6 h-6" />
                <div>
                  <p className="font-semibold">I want to work</p>
                  <p className="text-sm text-gray-500">
                    Find jobs and grow your business
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedOption}
              className={`w-full py-3 rounded-lg ${
                selectedOption
                  ? "bg-gray-900 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 FULL WIDTH FORM */}
        {/* DEVELOPER NOTE: name ar carone  component dui ta oultapalta heye heye geche  */}
        {step === "form" && selectedOption === "hire" && (
          <div className="w-full">
            {/* ai ta tar roll heb (USER) */}
            <WorkSignupForm />
            {/* <HireSignupForm /> */}
          </div>
        )}

        {step === "form" && selectedOption === "work" && (
          <div className="w-full">
            {/* ai ta tar roll heb (ALEVETOR) */}
            {/* <WorkSignupForm /> */}
            <HireSignupForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;

import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={imageUrl} alt="resume" />
      </div>
    </div>
  );
};

export default ResumeModal;

// import React, { useState, useEffect } from "react";

// const ResumeModal = ({ fileUrl, onClose }) => {
//   const [fileType, setFileType] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Determine file type based on URL extension
//     if (fileUrl) {
//       const extension = fileUrl.split('.').pop().toLowerCase();
//       setFileType(extension);
//       setIsLoading(true);
//     }
//   }, [fileUrl]);

//   const handleContentLoaded = () => {
//     setIsLoading(false);
//   };

//   const renderContent = () => {
//     if (!fileUrl) return <p className="text-lg text-gray-500">No file to display</p>;
    
//     if (isLoading) {
//       return (
//         <div className="flex items-center justify-center w-full h-full">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       );
//     }
    
//     if (fileType === "pdf") {
//       return (
//         <div className="w-full h-full">
//           <iframe
//             src={fileUrl}
//             className="w-full h-full border-0"
//             title="PDF document"
//             onLoad={handleContentLoaded}
//           />
//         </div>
//       );
//     } else {
//       // For images (jpg, png, etc.)
//       return (
//         <div className="flex items-center justify-center w-full h-full overflow-auto">
//           <img 
//             src={fileUrl} 
//             alt="Resume" 
//             className="max-w-full max-h-full object-contain"
//             onLoad={handleContentLoaded}
//           />
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-11/12 h-5/6 md:w-4/5 md:h-4/5 relative flex flex-col shadow-2xl">
//         <div className="flex justify-between items-center p-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium">
//             {fileType === "pdf" ? "PDF Resume" : "Resume Image"}
//           </h3>
//           <button 
//             className="text-gray-500 hover:text-gray-700 focus:outline-none"
//             onClick={onClose}
//             aria-label="Close"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         <div className="flex-1 overflow-hidden p-1">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeModal;
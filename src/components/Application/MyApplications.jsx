// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../../main";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import ResumeModal from "./ResumeModal";
// import { AiFillFilePdf } from 'react-icons/ai';

// const MyApplications = () => {
//   const { user, isAuthorized } = useContext(Context);
//   const [applications, setApplications] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [resumeImageUrl, setResumeImageUrl] = useState("");

//   const navigateTo = useNavigate();

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const url =
//           user && user.role === "Employer"
//             ? "http://localhost:4000/api/v1/application/employer/getall"
//             : "http://localhost:4000/api/v1/application/jobseeker/getall";

//         const response = await axios.get(url, {
//           withCredentials: true,
//         });
//         setApplications(response.data.applications);
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to fetch applications");
//       }
//     };

//     if (isAuthorized) {
//       fetchApplications();
//     } else {
//       navigateTo("/");
//     }
//   }, [isAuthorized, navigateTo, user]);

//   const deleteApplication = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
//         withCredentials: true,
//       });
//       toast.success(response.data.message);
//       setApplications((prevApplications) =>
//         prevApplications.filter((application) => application._id !== id)
//       );
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete application");
//     }
//   };

//   const openModal = (imageUrl) => {
//     setResumeImageUrl(imageUrl);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   return (
//     <section className="my_applications page">
//       <div className="container">
//         {user && user.role === "Job Seeker" ? (
//           <>
//             <h1>My Applications</h1>
//             {applications.length <= 0 ? (
//               <h4>No Applications Found</h4>
//             ) : (
//               applications.map((element) => (
//                 <JobSeekerCard
//                   element={element}
//                   key={element._id}
//                   deleteApplication={deleteApplication}
//                   openModal={openModal}
//                 />
//               ))
//             )}
//           </>
//         ) : (
//           <>
//             <h1>Applications From Job Seekers</h1>
//             {applications.length <= 0 ? (
//               <h4>No Applications Found</h4>
//             ) : (
//               applications.map((element) => (
//                 <EmployerCard
//                   element={element}
//                   key={element._id}
//                   openModal={openModal}
//                 />
//               ))
//             )}
//           </>
//         )}
//       </div>
//       {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
//     </section>
//   );
// };

// export default MyApplications;

// const JobSeekerCard = ({ element, deleteApplication, openModal }) => (
//   <div className="job_seeker_card">
//     <div className="detail">
//       <p>
//         <span>Name:</span> {element.name}
//       </p>
//       <p>
//         <span>Email:</span> {element.email}
//       </p>
//       <p>
//         <span>Phone:</span> {element.phone}
//       </p>
//       <p>
//         <span>Address:</span> {element.address}
//       </p>
//       <p>
//         <span>CoverLetter:</span> {element.coverLetter}
//       </p>
//     </div>
//     <div className="resume">
//       <img
//         src={element.resume.url}
//         alt="resume"
//         onClick={() => openModal(element.resume.url)}
//       />
//     </div>
//     <div className="btn_area">
//       <button onClick={() => deleteApplication(element._id)}>Delete Application</button>
//     </div>
//   </div>
// );

// const EmployerCard = ({ element, openModal }) => (
//   <div className="job_seeker_card">
//     <div className="detail">
//       <p>
//         <span>Name:</span> {element.name}
//       </p>
//       <p>
//         <span>Email:</span> {element.email}
//       </p>
//       <p>
//         <span>Phone:</span> {element.phone}
//       </p>
//       <p>
//         <span>Address:</span> {element.address}
//       </p>
//       <p>
//         <span>CoverLetter:</span> {element.coverLetter}
//       </p>
//     </div>
//     <div className="resume">
//       {element.resume.url.endsWith('.pdf') ? (
//         <AiFillFilePdf
//           size={50}
//           onClick={() => openModal(element.resume.url)}
//           style={{ cursor: 'pointer', color: 'red' }}
//         />
//       ) : (
//         <img
//           src={element.resume.url}
//           alt="resume"
//           onClick={() => openModal(element.resume.url)}
//         />
//       )}
//     </div>
//   </div>
// );


import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { AiFillFilePdf } from 'react-icons/ai';

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [emailSubject, setEmailSubject] = useState("Congratulations! Your application has been accepted");
  const [emailBody, setEmailBody] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || !user) {
      toast.error("Please login to view your applications");
      navigateTo("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const url = user && user.role === "Employer"
          ? "/application/employer/getall"
          : "/application/jobseeker/getall";

        const response = await api.get(url);
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        
        if (error.response?.status === 401) {
          toast.error("Please login to view your applications. Session may have expired.");
          navigateTo("/login");
        } else if (error.request) {
          // Network error
          toast.error("Network error. Please check your connection and try again.");
          setApplications([]);
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch applications");
          setApplications([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthorized, navigateTo, user]);

  const deleteApplication = async (id) => {
    try {
      const response = await api.delete(`/application/delete/${id}`);
      toast.success(response.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to delete applications. Session may have expired.");
        navigateTo("/login");
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete application");
      }
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openEmailModal = (applicant) => {
    setSelectedApplicant(applicant);
    setEmailBody(`Dear ${applicant.name},\n\nWe are pleased to inform you that your application has been accepted. We were impressed with your qualifications and experience, and we believe you would be a valuable addition to our team.\n\nWe would like to schedule an interview with you to discuss the position further. Please let us know your availability for the coming week.\n\nBest regards,\n${user?.name || 'The Hiring Team'}`);
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setSelectedApplicant(null);
  };

  const sendAcceptanceEmail = async () => {
    try {
      await api.post("/application/send-acceptance-email", {
        applicantId: selectedApplicant._id,
        applicantEmail: selectedApplicant.email,
        applicantName: selectedApplicant.name,
        subject: emailSubject,
        body: emailBody
      });
      toast.success(`Acceptance email sent to ${selectedApplicant.name}`);
      closeEmailModal();
      
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === selectedApplicant._id ? {...app, status: 'accepted'} : app
        )
      );
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to send emails. Session may have expired.");
        navigateTo("/login");
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to send acceptance email");
      }
    }
  };

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <section className="applications-section">
        <div className="applications-container">
          <h1>Loading applications...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="applications-section">
      <div className="applications-container">
        {user && user.role === "Job Seeker" ? (
          <>
            <h1 className="applications-title">My Applications</h1>
            {applications.length <= 0 ? (
              <div className="no-applications">
                <h4 className="no-applications-text">No Applications Found</h4>
                <button 
                  onClick={() => navigateTo("/job/getall")} 
                  className="browse-jobs-btn"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="applications-grid">
                {applications.map((element) => (
                  <JobSeekerCard
                    element={element}
                    key={element._id}
                    deleteApplication={deleteApplication}
                    openModal={openModal}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="applications-title">Applications From Job Seekers</h1>
            {applications.length <= 0 ? (
              <div className="no-applications">
                <h4 className="no-applications-text">No Applications Found</h4>
              </div>
            ) : (
              <div className="applications-grid">
                {applications.map((element) => (
                  <EmployerCard
                    element={element}
                    key={element._id}
                    openModal={openModal}
                    openEmailModal={openEmailModal}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
      
      {/* Email Acceptance Modal */}
      {emailModalOpen && selectedApplicant && (
        <div className="modal-overlay">
          <div className="email-modal">
            <div className="email-modal-header">
              <h3 className="email-modal-title">Accept Application from {selectedApplicant.name}</h3>
              <button
                onClick={closeEmailModal}
                className="close-modal-btn"
              >
                <span className="sr-only">Close</span>
                <svg className="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="email-modal-body">
              <div className="email-form">
                <div className="form-group">
                  <label htmlFor="recipient" className="form-label">
                    Recipient
                  </label>
                  <input
                    type="email"
                    id="recipient"
                    value={selectedApplicant.email}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="body" className="form-label">
                    Email Message
                  </label>
                  <textarea
                    id="body"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows="10"
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>
            
            <div className="email-modal-footer">
              <button
                onClick={closeEmailModal}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={sendAcceptanceEmail}
                className="accept-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="accept-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Accept & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// JobSeekerCard and EmployerCard components remain the same...
const JobSeekerCard = ({ element, deleteApplication, openModal }) => (
  <div className="application-card">
    <div className="application-card-content">
      <div className="application-details">
        <h3 className="application-card-title">Application Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <p className="detail-label">Name</p>
            <p className="detail-value">{element.name}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Email</p>
            <p className="detail-value">{element.email}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Phone</p>
            <p className="detail-value">{element.phone}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Address</p>
            <p className="detail-value">{element.address}</p>
          </div>
        </div>
        <div className="cover-letter-section">
          <p className="detail-label">Cover Letter</p>
          <p className="cover-letter-text">
            {element.coverLetter}
          </p>
        </div>
      </div>
      
      <div className="resume-actions">
        <div className="resume-preview">
          <p className="detail-label">Resume</p>
          <div className="resume-thumbnail" onClick={() => openModal(element.resume.url)}>
            {element.resume.url.endsWith('.pdf') ? (
              <div className="pdf-preview">
                <AiFillFilePdf size={50} className="pdf-icon" />
                <span className="pdf-label">View PDF</span>
              </div>
            ) : (
              <div className="image-preview">
                <img
                  src={element.resume.url}
                  alt="resume"
                  className="resume-image"
                />
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => deleteApplication(element._id)}
          className="withdraw-btn"
        >
          Withdraw Application
        </button>
      </div>
    </div>
  </div>
);

const EmployerCard = ({ element, openModal, openEmailModal }) => {
  const isAccepted = element.status === 'accepted';
  
  return (
    <div className="application-card">
      <div className="application-card-content">
        <div className="application-details">
          <div className="applicant-header">
            <h3 className="application-card-title">Applicant Details</h3>
            {isAccepted && (
              <span className="status-badge accepted">
                Accepted
              </span>
            )}
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <p className="detail-label">Name</p>
              <p className="detail-value">{element.name}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Email</p>
              <p className="detail-value">{element.email}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Phone</p>
              <p className="detail-value">{element.phone}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Address</p>
              <p className="detail-value">{element.address}</p>
            </div>
          </div>
          <div className="cover-letter-section">
            <p className="detail-label">Cover Letter</p>
            <p className="cover-letter-text">
              {element.coverLetter}
            </p>
          </div>
        </div>
        
        <div className="resume-actions">
          <div className="resume-preview">
            <p className="detail-label">Resume</p>
            <div className="resume-thumbnail" onClick={() => openModal(element.resume.url)}>
              {element.resume.url.endsWith('.pdf') ? (
                <div className="pdf-preview">
                  <AiFillFilePdf size={50} className="pdf-icon" />
                  <span className="pdf-label">View PDF</span>
                </div>
              ) : (
                <div className="image-preview">
                  <img
                    src={element.resume.url}
                    alt="resume"
                    className="resume-image"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="employer-actions">
            {!isAccepted ? (
              <button 
                onClick={() => openEmailModal(element)}
                className="accept-email-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="email-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Accept & Email
              </button>
            ) : (
              <button 
                className="already-accepted-btn"
                disabled
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Already Accepted
              </button>
            )}
            
            <button className="contact-btn">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
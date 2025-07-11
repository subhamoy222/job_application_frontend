// import axios from "axios";
// import React, { useContext, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import { Context } from "../../main";

// const Application = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [resume, setResume] = useState(null);

//   const { isAuthorized, user } = useContext(Context);
//   const navigateTo = useNavigate();
//   const { id } = useParams();

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setResume(file);
//     }
//   };

//   const handleApplication = async (e) => {
//     e.preventDefault();
    
//     if (!resume) {
//       toast.error("Please upload a resume.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("phone", phone);
//     formData.append("address", address);
//     formData.append("coverLetter", coverLetter);
//     formData.append("resume", resume);
//     formData.append("jobId", id);

//     try {
//       const { data } = await axios.post(
//         "https://job-application-backend-6jgg.onrender.com/api/v1/application/post",
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setName("");
//       setEmail("");
//       setCoverLetter("");
//       setPhone("");
//       setAddress("");
//       setResume(null);
//       toast.success(data.message);
//       navigateTo("/job/getall");
//     } catch (error) {
//       console.error("Error during application:", error); // Log the error
//       toast.error(error.response?.data?.message || "An error occurred");
//     }
//   };

//   if (!isAuthorized || (user && user.role === "Employer")) {
//     navigateTo("/");
//     return null;
//   }

//   return (
//     <section className="application">
//       <div className="container">
//         <h3>Application Form</h3>
//         <form onSubmit={handleApplication}>
//           <input
//             type="text"
//             placeholder="Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="email"
//             placeholder="Your Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Your Phone Number"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Your Address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />
//           <textarea
//             placeholder="Cover Letter..."
//             value={coverLetter}
//             onChange={(e) => setCoverLetter(e.target.value)}
//           />
//           <div>
//             <label
//               style={{ textAlign: "start", display: "block", fontSize: "20px" }}
//             >
//               Select Resume
//             </label>
//             <input
//               type="file"
//               accept=".pdf, .jpg, .png"
//               onChange={handleFileChange}
//               style={{ width: "100%" }}
//             />
//           </div>
//           <button type="submit">Send Application</button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Application;

// Application.jsx - Fixed version
import api from "../../utils/axios.js";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  // Check authentication on component mount
  React.useEffect(() => {
    if (!isAuthorized) {
      toast.error("Please login to submit application");
      navigateTo("/login");
      return;
    }
    if (user && user.role === "Employer") {
      toast.error("Employers cannot submit job applications");
      navigateTo("/");
      return;
    }
  }, [isAuthorized, user, navigateTo]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    
    // Check authentication before submitting
    if (!isAuthorized || !user) {
      toast.error("Please login to submit application");
      navigateTo("/login");
      return;
    }

    if (!resume) {
      toast.error("Please upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await api.post("/application/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      console.error("Error during application:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Please login to submit application. Session may have expired.");
        navigateTo("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred while submitting application");
      }
    }
  };

  // Don't render if not authorized
  if (!isAuthorized || (user && user.role === "Employer")) {
    return null;
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Select Resume *
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
              required
            />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default Application;


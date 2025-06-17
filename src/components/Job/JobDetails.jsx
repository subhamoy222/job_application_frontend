// import React, { useContext, useEffect, useState } from "react";

// // useParams is used to get the job ID from the URL. For example, if the URL is /job/123, id will be 123.
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// //if the user is login or not
// import { Context } from "../../main";
// const JobDetails = () => {
//   const { id } = useParams();
//   const [job, setJob] = useState({});
//   const navigateTo = useNavigate();

//   const { isAuthorized, user } = useContext(Context);


// // useEffect is used to fetch job details from the server when the component mounts.
// // Axios sends a GET request to http://localhost:4000/api/v1/job/{id} to get the job details.
//   useEffect(() => {
//     axios
//       .get(`https://job-application-backend-6jgg.onrender.com/api/v1/job/${id}`, {
//         withCredentials: true,
//       })
//       .then((res) => {
//         setJob(res.data.job);
//       })
//       .catch((error) => {
//         navigateTo("/notfound");
//       });
//   }, []);

//   if (!isAuthorized) {
//     navigateTo("/login");
//   }

//   return (
//     <section className="jobDetail page">
//       <div className="container">
//         <h3>Job Details</h3>
//         <div className="banner">
//           <p>
//             Title: <span> {job.title}</span>
//           </p>
//           <p>
//             Category: <span>{job.category}</span>
//           </p>
//           <p>
//             Country: <span>{job.country}</span>
//           </p>
//           <p>
//             City: <span>{job.city}</span>
//           </p>
//           <p>
//             Location: <span>{job.location}</span>
//           </p>
//           <p>
//             Description: <span>{job.description}</span>
//           </p>
//           <p>
//             Job Posted On: <span>{job.jobPostedOn}</span>
//           </p>
//           <p>
//             Salary:{" "}
//             {job.fixedSalary ? (
//               <span>{job.fixedSalary}</span>
//             ) : (
//               <span>
//                 {job.salaryFrom} - {job.salaryTo}
//               </span>
//             )}
//           </p>
//           {user && user.role === "Employer" ? (
//             <></>
//           ) : (
//             <Link to={`/application/${job._id}`}>Apply Now</Link>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default JobDetails;

import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }

    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://job-application-backend-6jgg.onrender.com/api/v1/job/${id}`,
          {
            withCredentials: true,
          }
        );
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
        
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigateTo("/login");
        } else if (error.response?.status === 404) {
          toast.error("Job not found.");
          navigateTo("/notfound");
        } else {
          const errorMessage = error.response?.data?.message || "Failed to load job details";
          toast.error(errorMessage);
          setError(errorMessage);
          // Don't navigate away on other errors, let user retry
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isAuthorized, navigateTo]);

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <section className="jobDetail page">
        <div className="container">
          <h3>Loading job details...</h3>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="jobDetail page">
        <div className="container">
          <h3>Error Loading Job</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
          <Link to="/job/getall">Back to Jobs</Link>
        </div>
      </section>
    );
  }

  // Check if job data exists
  if (!job || Object.keys(job).length === 0) {
    return (
      <section className="jobDetail page">
        <div className="container">
          <h3>Job Not Found</h3>
          <Link to="/job/getall">Back to Jobs</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.title || 'N/A'}</span>
          </p>
          <p>
            Category: <span>{job.category || 'N/A'}</span>
          </p>
          <p>
            Country: <span>{job.country || 'N/A'}</span>
          </p>
          <p>
            City: <span>{job.city || 'N/A'}</span>
          </p>
          <p>
            Location: <span>{job.location || 'N/A'}</span>
          </p>
          <p>
            Description: <span>{job.description || 'N/A'}</span>
          </p>
          <p>
            Job Posted On: <span>{job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : 'N/A'}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom && job.salaryTo ? `${job.salaryFrom} - ${job.salaryTo}` : 'N/A'}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;


// You click on a job titled "Software Engineer" which has an ID of 123. The URL changes to /job/123.
// Fetching Job Details:

// The component reads the 123 from the URL.
// It sends a request to the server to get the details of the job with ID 123.
// The server responds with details about the "Software Engineer" job, like its title, category, location, description, and salary.
// Checking User Authorization:

// The component checks if you are logged in.
// If you are not logged in, you are redirected to the login page.
// If you are logged in, the job details are displayed.
// Displaying Job Details:


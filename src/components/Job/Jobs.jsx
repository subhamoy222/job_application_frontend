// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { Context } from "../../main";

// //The component uses useState to create a state variable jobs to store the list of jobs.
// const Jobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const { isAuthorized } = useContext(Context);
//   const navigateTo = useNavigate();
//   useEffect(() => {
//     try {
//       axios
//         .get("https://job-application-backend-6jgg.onrender.com/api/v1/job/getall", {
//           withCredentials: true,
//         })
//         .then((res) => {
//           setJobs(res.data);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   //if the user is not authorized then he redirected to home page.
//   if (!isAuthorized) {
//     navigateTo("/");
//   }

//   return (
//     <section className="jobs page">
//       <div className="container">
//         <h1>ALL AVAILABLE JOBS</h1>
//         <div className="banner">
//           {jobs.jobs &&
//             jobs.jobs.map((element) => {
//               return (
//                 <div className="card" key={element._id}>
//                   <p>{element.title}</p>
//                   <p>{element.category}</p>
//                   <p>{element.country}</p>
//                   <Link to={`/job/${element._id}`}>Job Details</Link>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Jobs;


// Jobs.jsx - Fixed version
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://job-application-backend-6jgg.onrender.com/api/v1/job/getall",
          {
            withCredentials: true,
          }
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigateTo("/login");
        } else {
          toast.error("Failed to load jobs");
          setJobs({ jobs: [] });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthorized, navigateTo]);

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <section className="jobs page">
        <div className="container">
          <h1>Loading jobs...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.jobs && jobs.jobs.length > 0 ? (
            jobs.jobs.map((element) => (
              <div className="card" key={element._id}>
                <p>{element.title}</p>
                <p>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Job Details</Link>
              </div>
            ))
          ) : (
            <div>
              <h3>No jobs available at the moment</h3>
              <p>Please check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
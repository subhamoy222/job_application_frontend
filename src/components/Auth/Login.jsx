import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import api from "../../utils/axios.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/login", { email, password, role });
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        // Network error (CORS, no internet, etc.)
        toast.error("Network error. Please check your connection and try again.");
        console.error("Network error:", error.message);
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Login error:", error.message);
      }
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            {/* <img src="/JobZeelogo.png" alt="logo" /> */}
            <h3>Login to your account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
        {/* <div className="banner">
          <img src="/login.png" alt="login" />
        </div> */}
      </section>
    </>
  );
};

export default Login;


// import React, { useContext, useState } from "react";
// import { RiLock2Fill } from "react-icons/ri";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { Link, Navigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Context } from "../../main";
// import { FaPhone } from "react-icons/fa";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Job Seeker");
//   const { isAuthorized, setIsAuthorized } = useContext(Context);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/v1/user/login",
//         { email, password, role },
//         { headers: { "Content-Type": "application/json" }, withCredentials: true }
//       );
//       toast.success(data.message);
//       setIsAuthorized(true);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//     }
//   };

//   if (isAuthorized) return <Navigate to="/" />;

//   return (
//     <section className="authPage">
//       <div className="container">
//         <div className="header">
//           <h3>Login to your account</h3>
//         </div>
//         <form onSubmit={handleLogin}>
//           <div className="inputTag">
//             <label>Email Address</label>
//             <div>
//               <input type="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
//               <MdOutlineMailOutline className="icon" />
//             </div>
//           </div>
//           <div className="inputTag">
//             <label>Password</label>
//             <div>
//               <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//               <RiLock2Fill className="icon" />
//             </div>
//           </div>
//           <div className="inputTag">
//             <label>Role</label>
//             <div>
//               <select value={role} onChange={(e) => setRole(e.target.value)}>
//                 <option value="Job Seeker">Job Seeker</option>
//                 <option value="Employer">Employer</option>
//               </select>
//             </div>
//           </div>
//           <button type="submit" className="login-btn">Login</button>
//           <Link to="/register" className="register-link">Register Now</Link>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Login;

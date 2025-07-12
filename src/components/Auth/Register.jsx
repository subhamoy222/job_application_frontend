// import React, { useContext, useState } from "react";
// import { FaRegUser } from "react-icons/fa";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { RiLock2Fill } from "react-icons/ri";
// import { FaPencilAlt } from "react-icons/fa";
// import { FaPhoneFlip } from "react-icons/fa6";
// import { Link, Navigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Context } from "../../main";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");

//   const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

//   //after user submitting all details handleregister function calls
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/v1/user/register",

//         { name, phone, email, role, password },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
//       toast.success(data.message);
//       setName("");
//       setEmail("");
//       setPassword("");
//       setPhone("");
//       setRole("");
//       setIsAuthorized(true);
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };


//   //If the user is already authorized (isAuthorized is true), the component redirects them to the homepage.
//   if(isAuthorized){
//     return <Navigate to={'/'}/>
//   }


//   return (
//     <>
//       <section className="authPage">
//         <div className="container">
//           <div className="header">
//             <img src="/JobZeelogo.png" alt="logo" />
//             <h3>Create a new account</h3>
//           </div>
//           <form>
//             <div className="inputTag">
//               <label>Register As</label>
//               <div>
//                 <select value={role} onChange={(e) => setRole(e.target.value)}>
//                   <option value="">Select Role</option>
//                   <option value="Employer">Employer</option>
//                   <option value="Job Seeker">Job Seeker</option>
//                 </select>
//                 <FaRegUser />
//               </div>
//             </div>
//             <div className="inputTag">
//               <label>Name</label>
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Enter your name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <FaPencilAlt />
//               </div>
//             </div>
//             <div className="inputTag">
//               <label>Email Address</label>
//               <div>
//                 <input
//                   type="email"
//                   placeholder="abc@gmail.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <MdOutlineMailOutline />
//               </div>
//             </div>
//             <div className="inputTag">
//               <label>Phone Number</label>
//               <div>
//                 <input
//                   type="number"
//                   placeholder="1234567890"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//                 <FaPhoneFlip />
//               </div>
//             </div>
//             <div className="inputTag">
//               <label>Password</label>
//               <div>
//                 <input
//                   type="password"
//                   placeholder="Your Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <RiLock2Fill />
//               </div>
//             </div>
//             <button type="submit" onClick={handleRegister}>
//               Register
//             </button>
//             <Link to={"/login"}>Login Now</Link>
//           </form>
//         </div>
//         <div className="banner">
//           <img src="/register.png" alt="login" />
//         </div>
//       </section>
//     </>
//   );
// };

// export default Register;


// //User Visits Registration Page:

// //A user named "John Doe" visits your website and wants to register for an account.
// //User Fills Out the Form:

// //John enters his details:
// //Name: John Doe
// //Email: john.doe@example.com
// //Phone: 1234567890
// // Password: securepassword
// // Role: Job Seeker
// // User Submits the Form:

// // John clicks the "Register" button.
// // The handleRegister function is called:
// // It sends John's details to the server.
// // The server responds with a success message.
// // A success toast message is shown to John.
// // The form fields are cleared.
// // John is marked as authorized (isAuthorized is set to true).
// // User is Redirected:

// // Since John is now authorized, he is redirected to the homepage.


import React, { useContext, useState } from "react";
import { RiLock2Fill } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { FaPhone, FaUser } from "react-icons/fa";
import api from "../../utils/axios.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",  
        { email, password, role },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <h3>Login to your account</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input type="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <MdOutlineMailOutline className="icon" />
            </div>
          </div>
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <RiLock2Fill className="icon" />
            </div>
          </div>
          <div className="inputTag">
            <label>Role</label>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Employer">Employer</option>
              </select>
            </div>
          </div>
          <button type="submit" className="login-btn">Login</button>
          <Link to="/register" className="register-link">Register Now</Link>
        </form>
      </div>
    </section>
  );
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/register", { name, email, password, phone, role });
      toast.success(data.message);
      setIsAuthorized(true);
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Network error (CORS, no internet, etc.)
        toast.error("Network error. Please check your connection and try again.");
        console.error("Network error:", error.message);
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Registration error:", error.message);
      }
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <h3>Create a new account</h3>
        </div>
        <form onSubmit={handleRegister}>
          <div className="inputTag">
            <label>Name</label>
            <div>
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              <FaUser className="icon" />
            </div>
          </div>
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input type="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <MdOutlineMailOutline className="icon" />
            </div>
          </div>
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <RiLock2Fill className="icon" />
            </div>
          </div>
          <div className="inputTag">
            <label>Phone Number</label>
            <div>
              <input type="text" placeholder="Your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <FaPhone className="icon" />
            </div>
          </div>
          <div className="inputTag">
            <label>Role</label>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Employer">Employer</option>
              </select>
            </div>
          </div>
          <button type="submit" className="register-btn">Register</button>
          <Link to="/login" className="login-link">Already have an account? Login</Link>
        </form>
      </div>
    </section>
  );
};

export { Login, Register };

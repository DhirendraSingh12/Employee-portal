// import React, { useState } from "react";
// import { TextField, Button, Box, Typography } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { loginvalidation } from "../../../Utils/validation";
// import "./Login.css";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { BackgroundOvrlay } from "../../../components/BackgroundOverlay/BackgroundOverlay";
// import { loginEmployee } from "../../EmpApiServices";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../../Redux/authSlice/authSlice";
// import {jwtDecode} from "jwt-decode"; // Import jwt-decode to decode JWT tokens

// const Login = () => {
//   const [employeeId, setUsemployeeID] = useState("");
//   const [password, setPassword] = useState("");
//   const [apiError, setApiError] = useState("");
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrors({});
//     setApiError("");
//     setIsSubmitting(true);
//     try {
//       await loginvalidation.validate(
//         { employeeId, password },
//         { abortEarly: false }
//       );
//       const data = await loginEmployee(employeeId, password);
//       const { jwtToken, redirectUrl } = data;
//       localStorage.setItem("jwtToken", jwtToken);

//       const decodedToken = jwtDecode(jwtToken);
//       dispatch(loginSuccess({ user: decodedToken, token: jwtToken }));
//             navigate(redirectUrl || "/dashboard");
//       toast.success('Login successful');
//     } catch (error) {
//       if (error.name === "ValidationError") {
//         const formattedErrors = error.inner.reduce((acc, err) => {
//           acc[err.path] = err.message;
//           return acc;
//         }, {});
//         setErrors(formattedErrors);
//       } else {
//         setApiError(error.message || "An error occurred during login."); // Ensure the error is displayed
//         toast.error(error.message || "An error occurred during login.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="login-background">
//       <BackgroundOvrlay />
//       <img
//         src="/assets/logo/hirefleX247.com-Light.png"
//         alt="Company Logo"
//         className="login-logo"
//       />
//       <Box className="login-form-container">
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Enter employeeID"
//             variant="outlined"
//             className="custom-text-field"
//             fullWidth
//             margin="normal"
//             value={employeeId}
//             onChange={(e) => setUsemployeeID(e.target.value)}
//             error={Boolean(errors.employeeId)}
//             helperText={errors.employeeId}
//           />
//           <TextField
//             label="Enter Password"
//             variant="outlined"
//             className="custom-text-field"
//             fullWidth
//             margin="normal"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             error={Boolean(errors.password)}
//             helperText={errors.password}
//           />
//           {apiError && (
//             <Typography color="error" variant="body2">
//               {apiError}
//             </Typography>
//           )}
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             className="login-button"
//             disabled={isSubmitting}
//           >
//             Login
//           </Button>
//         </form>
//         <div className="text-black p-1 mt-2">
//           <Typography variant="body2">
//             <Link to="/register">
//               Need assistance with Login/Registration? <br />
//             </Link>
//           </Typography>
//           <Typography variant="body2">Email: hr@hireflex247.com</Typography>
//         </div>
//       </Box>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import "./Login.css"; // Make sure to define styles in this CSS file
import login from "../../../components/assets/Icons/login-page.png"; // Replace with the correct logo path
import companyLogo from "../../../components/assets/Icons/hirefleX247.com-dark.png";
import peopleProfile from "../../../components/assets/Icons/manager.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Adminloginvalidation,
  SuperAdminloginvalidation,
} from "../../../Utils/validation"; // Super Admin validation
import { loginvalidation } from "../../../Utils/validation"; // Employee validation
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { BackgroundOvrlay } from "../../../components/BackgroundOverlay/BackgroundOverlay";
import { loginSuperAdmin } from "../../../SuperAdmin/ApiServices";
import { loginEmployee } from "../../EmpApiServices";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice/authSlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
} from "@mui/material";
import { loginAdmin } from "../../../Admin/APIServices";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("Super Admin");
  const [showAssistanceLink, setShowAssistanceLink] = useState(true);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Reset validation errors
    setApiError(""); // Reset API error
    setIsSubmitting(true);

    try {
      if (selectedUserType === "Super Admin") {
        // Super Admin Login
        await SuperAdminloginvalidation.validate(
          { username, password },
          { abortEarly: false }
        );
        const data = await loginSuperAdmin({ username, password });
        if (data.jwtToken) {
          localStorage.setItem("jwtToken", data.jwtToken);
          toast.success("Super Admin Login Success");
          navigate("/superadmin/dashboard");
        }
      } else if (selectedUserType === "Employee") {
        // Employee Login
        await loginvalidation.validate(
          { employeeId, password },
          { abortEarly: false }
        );
        const data = await loginEmployee(employeeId, password);
        const { jwtToken, redirectUrl } = data;
        localStorage.setItem("jwtToken", jwtToken);
        const decodedToken = jwtDecode(jwtToken);
        dispatch(loginSuccess({ user: decodedToken, token: jwtToken }));
        navigate(redirectUrl || "/dashboard");
        toast.success("Login successful");
      } else if (selectedUserType === "Admin") {
        // Admin Login
        await Adminloginvalidation.validate(
          { username, password },
          { abortEarly: false }
        );
        const data = await loginAdmin({ username, password });
        if (data.jwtToken) {
          localStorage.setItem("jwtToken", data.jwtToken);
          toast.success("Admin Login Success");
          navigate("/admin/dashboard");
        }
      } else {
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const formattedErrors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      } else {
        const errorMessage =
          error.response?.data?.error || "Invalid username or password";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
    setShowAssistanceLink(userType !== "Employee");
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="company-header-container">
          {/* <img src={companyLogo} alt="Hireflex Logo" className="logo" /> */}
        </div>
        <div className="image-section">
          <img src={login} alt="Login Illustration" />
        </div>
      </div>
      <div className="right-section">
        <div className="login-header">
          <h1>
            {/* Welcome to{" "} */}
            <img
              src={companyLogo}
              alt="company-logo"
              className="company-logo1"
            />
          </h1>
        </div>
        <div className="UserSelectButton">
          <div className="user-type-selector">
            <DynamicButton
              text="Employee"
              onClick={() => handleUserTypeClick("Employee")}
              height="40px"
              width="150px"
              backgroundColor={
                selectedUserType === "Employee" ? "#6674a9" : "black"
              }
              color="white"
              isActive={selectedUserType === "Employee"}
            />
            <DynamicButton
              text="SuperAdmin"
              onClick={() => handleUserTypeClick("Super Admin")}
              height="40px"
              width="150px"
              backgroundColor={
                selectedUserType === "Super Admin" ? "#6674a9" : "black"
              }
              color="white"
              isActive={selectedUserType === "Super Admin"}
            />
            <DynamicButton
              text="Admin"
              onClick={() => handleUserTypeClick("Admin")}
              height="40px"
              width="150px"
              backgroundColor={
                selectedUserType === "Admin" ? "#6674a9" : "black"
              }
              color="white"
              isActive={selectedUserType === "Admin"}
            />
          </div>
        </div>
        {selectedUserType === "Super Admin" && (
          <div className="EmployeeLogin">
            <div className="login-background">
              <Box className="login-form-container">
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Enter username"
                    variant="outlined"
                    className="custom-text-field"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                  />
                  <TextField
                    label="Enter Password"
                    variant="outlined"
                    className="custom-text-field"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                  {apiError && (
                    <Typography color="error" variant="body2">
                      {apiError}
                    </Typography>
                  )}
                  <div className="mt-3">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="login-button"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                  </div>
                </form>
                <div className="text-black p-1 mt-4">
                  <Typography variant="body2">
                    <Link to="/register">
                      Need assistance with Login/Registration? <br />
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    Email: hr@hireflex247.com
                  </Typography>
                </div>
              </Box>
              <ToastContainer />
            </div>
          </div>
        )}
        {selectedUserType === "Admin" && (
          <div className="EmployeeLogin">
            <div className="login-background">
              <Box className="login-form-container">
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Enter username"
                    variant="outlined"
                    className="custom-text-field"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                  />
                  <TextField
                    label="Enter Password"
                    variant="outlined"
                    className="custom-text-field"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                  {apiError && (
                    <Typography color="error" variant="body2">
                      {apiError}
                    </Typography>
                  )}
                  <div className="mt-3">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="login-button"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                  </div>
                </form>
                <div className="text-black p-1 mt-4">
                  <Typography variant="body2">
                    <Link to="/register">
                      Need assistance with Login/Registration? <br />
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    Email: hr@hireflex247.com
                  </Typography>
                </div>
              </Box>
              <ToastContainer />
            </div>
          </div>
        )}
        {selectedUserType === "Employee" && (
          <div className="EmployeeLogin">
            <div className="login-background">
              <Box className="login-form-container">
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Enter employeeID"
                    variant="outlined"
                    className="custom-text-field"
                    fullWidth
                    margin="normal"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    error={Boolean(errors.employeeId)}
                    helperText={errors.employeeId}
                  />
                  <TextField
                    label="Enter Password"
                    variant="outlined"
                    className="custom-text-field"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                  {apiError && (
                    <Typography color="error" variant="body2">
                      {apiError}
                    </Typography>
                  )}
                  <div className="mt-3">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="login-button"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                  </div>
                </form>
                <div className="text-black p-1 mt-4">
                  {showAssistanceLink && (
                    <Typography variant="body2">
                      <Link to="/register">
                        Need assistance with Login/Registration? <br />
                      </Link>
                    </Typography>
                  )}
                  <Typography variant="body2">
                    Email: hr@hireflex247.com
                  </Typography>
                </div>
              </Box>
              <ToastContainer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

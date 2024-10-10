import axios from "axios";
import { toast } from "react-toastify";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL: ", process.env.REACT_APP_API_URL);

API.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || "Internal server error occurred";
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export const loginEmployee = async (employeeId, password) => {
  try {
    const response = await API.post("/employees/login", {
      employeeId,
      password,
    });
    const { jwtToken } = response.data;
    if (jwtToken) {
      localStorage.setItem("jwtToken", jwtToken);
      toast.success("Login successful");
      return { jwtToken };
    }
  } catch (error) {
    throw error.response?.data?.error || "Invalid Employee ID or Password";
  }
};

//dailog seccion
export const fetchDialogueSessions = async (employeeId) => {
  try {
    const response = await API.get(`/employees/dialoguesessions/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dialogue sessions:", error);
    throw error;
  }
};

//chate employee
export const fetchGreetMessage = async () => {
    const response = await API.get("/chatbot/greet");
    return response.data;
};

// Send user query and get response from chatbot
export const sendUserMessage = async (userMessage) => {
  try {
    const response = await axios.post("/chatbot/query", {
      message: userMessage  // Use "message" as the key instead of "query" if that's expected
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


//perks
export const fetchPerksDatas = async () => {
    const response = await API.get("/employees/perks"); 
    return response.data; 
};

//leave request
export const submitLeaveRequest = async (leaveRequestData, jwtToken) => {
  try {
    const response = await API.post("/employees/leave/submit", leaveRequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`, // Use JWT token in Authorization header
      },
    });
    toast.success("Leave request submitted successfully");
    return response.data;
  } catch (error) {
    console.error("Error submitting leave request:", error);
    toast.error("Failed to submit leave request");
    throw error;
  }
};
export const fetchApprovedLeaveRequests = async () => {
  const response = await API.get('/superadmin/alltimeoff '); // Adjust the API endpoint as necessary
  return response;
};



export const DocumentUpload = async (formDataToSend) => {
  try {
    const response = await API.post(`/employees/documents/upload`, formDataToSend, {
      headers: {
        "Content-Type": "application/json", 
      },
    });
    toast.success("Document uploaded successfully");
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    toast.error("Failed to upload document");
    throw error;
  }
};

// export const submitTimesheets = async (timesheetData, jwtToken) => {
//   try {
//     const response = await API.post("/employees/timesheets/submit", timesheetData, {
//       headers: {
//         'Authorization': `Bearer ${jwtToken}`,
//         // Axios automatically sets the Content-Type header based on the data type
//       },
//     });
//     return response.data;
//   } catch (error) {
//     // Log the error for debugging
//     console.error("Error submitting timesheet:", error.response?.data || error.message);
//     // Throw the error to be handled by the calling function
//     throw new Error(error.response?.data?.message || "An error occurred while submitting timesheet");
//   }
// };
export const submitTimesheets = async (payload, jwtToken) => {
  try {
    const response = await API.post("/employees/timesheets/submit", payload, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        // Axios automatically sets the Content-Type header based on the data type
      },
    });
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error("Error submitting timesheet:", error.response?.data || error.message);
    // Throw the error to be handled by the calling function
    throw new Error(error.response?.data?.message || "An error occurred while submitting timesheet");
  }
};
export const fetchTimesheets = async (employeeId) => {
  const response = await API.get( `/superadmin/timesheets/${employeeId}`, {
  });
  return response.data;

};


//policies
export const fetchPoliciesDatas = async () => {
    const response = await API.get("/superadmin/allpolicies"); 
    return response.data; 
};


//Submit Expense


export const fetchExpenses = async () => {
    const response = await API.get("/superadmin/allexpenses", {
    });
    return response.data;
  
};

export const submitExpenseRequest = async (expenseRequestData) => {
  try {
    const response = await API.post("/employees/expenses/submit", expenseRequestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("Expense request submitted successfully");
    return response.data;
  } catch (error) {
    console.error("Error submitting expense request:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to submit expense request");
    throw error;
  }
};

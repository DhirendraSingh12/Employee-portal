import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || "Internal server error occurred";
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

//Super Admin Add Edit and Delete select all delete
export const getAllEmployees = async () => {
    const response = await API.get("/superadmin/allemployees");
    return response.data;
};
export const fetchEmployeeById = async (employeeId) => {
  try {
    const response = await API.get(`/superadmin/getemployees/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchEmployeeById:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const addBulkEmployees = async (fileData) => {
  try {
    const response = await API.post("/superadmin/bulkemployee", fileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await API.post("/superadmin/addemployee", employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Employee added successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const editEmployee = async (employeeId, employeeData) => {
  try {
    const response = await API.put(
      `/superadmin/editemployees/${employeeId}`,
      employeeData
    );
    console.log("API Response:", response.employeeData);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {}
};

export const deleteUser = async (employeeId) => {
  try {
    const response = await API.delete(
      `/superadmin/deleteemployees/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error(error.response?.data?.message || "Error deleting user");
    throw error;
  }
};

export const deleteSelectedUsers = async (ids) => {
  try {
    const deletePromises = ids.map((employeeId) =>
      API.delete(`/superadmin/deleteemployees/${employeeId}`)
    );
    const responses = await Promise.all(deletePromises);
    responses.forEach((response) => {
      toast.success(response.data.message);
    });
    return responses;
  } catch (error) {
    throw error;
  }
};

//Super Admin Login Services
export const loginSuperAdmin = async (credentials) => {
  try {
    const response = await API.post("/superadmin/login", credentials);
    const { jwtToken } = response.data;
    if (jwtToken) {
      toast.success("Login successful");
      return { jwtToken };
    }
  } catch (error) {
    throw error;
  }
};

//AddAssets Services api service

export const addAsset = async (formDataToSend) => {
  try {
    const response = await API.post(
      "/superadmin/addassets",
      formDataToSend,
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllAssets = async () => {
    const response = await API.get("/superadmin/allassets");
    return response.data;
};

export const updateAsset = async (assetId, assetData) => {
  try {
    const response = await API.put(
      `/superadmin/editassets/${assetId}`,
      assetData,
      {}
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to update asset.");
    throw error;
  }
};
export const deleteassets = async (assetId) => {
  try {
    const response = await API.delete(`/superadmin/deleteassets/${assetId}`);
    toast.success("Asset deleted successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting asset");
    throw error;
  }
};

export const deleteAllassets = async (assetId) => {
  try {
    const response = await API.delete(`/superadmin/deleteassets/${assetId}`);
    toast.success("asstes deleted successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting user");
    throw error;
  }
};

//Metting Recod dailog all apis

export const addMeetingRecord = async (formData) => {
  try {
    const response = await API.post(`/superadmin/createsession`, formData, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMeettingRecod = async () => {
    const response = await API.get("/superadmin/allsession");
    return response.data;
};

export const updateMeetingRecod = async (sessionId, data) => {
  try {
    const response = await API.put(
      `/superadmin/editsession/${sessionId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteaDailog = async (sessionId) => {
  try {
    const response = await API.delete(`/superadmin/deletesession/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    toast.error(error.response?.data?.message || "Error deleting asset");
    throw error;
  }
};
//Perks Services

export const addPerk = async (formData) => {
  try {
    const response = await API.post("/superadmin/addperks", formData);
    return response.data;
  } catch (error) {
    console.error("Error adding perk:", error);
    throw error; 
  }
};

export const fetchAllPerksData = async () => {
    const response = await API.get("superadmin/allperks");
    return response.data;
};

export const deletePerk = async (perkId) => {
  try {
    const response = await API.delete(`/superadmin/deletePerk/${perkId}`);
    toast.success("Perks deleted successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//  Documents Services
export const createSession = async (formData) => {
  try {
    const response = await API.post("/superadmin/adddocuments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeDocuments = async () => {
    const response = await API.get("/superadmin/alldocuments"); 
    return response.data; 
  };


  export const policies = async (formData) => {
    try {
      const response = await API.post("/superadmin/addpolicies", formData, {
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const fetchPoliciesDatas = async () => {
  const response = await API.get("/superadmin/allpolicies"); 
  return response.data; 
};


export const fetchalltimeoff = async () => {
    const response = await API.get("/superadmin/alltimeoff");
    return response.data;
  }

export const approveTimeOff = async (leaveId) => {
  try {
    const response = await API.put(`/superadmin/approvetimeoff/${leaveId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectTimeOff = async (leaveId) => {
  try {
    const response = await API.put(`/superadmin/rejecttimeoff/${leaveId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};

export const getAllTimesheets = async () => {
    const response = await API.get("/superadmin/alltimesheets");
    return response.data; 
  
};
export const getTimesheetById = async (employeeId) => {
  const response = await API.get(`/superadmin/timesheets/${employeeId}`); 
  return response.data;
};

export const approveTimesheet = async (timesheetId) => {
  try {
    const response = await API.put(`/superadmin/approveTimesheet/${timesheetId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectTimesheet = async (timesheetId) => {
  try {
    const response = await API.put(`/superadmin/rejectTimesheet/${timesheetId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};

//Fetch Expenses

export const fetchAllExpenseData = async () => {
    const response = await API.get("/superadmin/allexpenses");
    return response.data;
};

export const approveExpense = async (expenseId) => {
  try {
    const response = await API.put(`/superadmin/approveExpense/${expenseId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectExpense = async (expenseId) => {
  try {
    const response = await API.put(`/superadmin/rejectExpense/${expenseId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};

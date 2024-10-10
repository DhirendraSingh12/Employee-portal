import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { LeaveRequestValidationTimeOff } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TimeoffPup.css";
import { submitLeaveRequest } from "../../EmpApiServices";

const AssestAdmin = ({ open, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    endDate: "",
    partialDays: "",
    reason: "",
    startDate: "",
    type: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LeaveRequestValidationTimeOff.validate(formData, {
        abortEarly: false,
      });
      setErrors({});
      setIsLoading(true); // Start loading state

      const formDataToSend = new FormData();
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("partialDays", formData.partialDays);
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("status", formData.status);

      const employeeId = localStorage.getItem("employeeId");
      formDataToSend.append("employeeId", employeeId);

      const jwtToken = localStorage.getItem("jwtToken");

      await submitLeaveRequest(formDataToSend, jwtToken);
      setTimeout(() => {
        onClose();
        setIsLoading(false); // Stop loading state
      }, 3000);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill in the required fields.");
      } else {
        toast.error("An unexpected error occurred");
      }
      setIsLoading(false); // Stop loading state in case of error
    }
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: "dialog" }}>
      <div className="timeoff-Container">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{"New Leave Request"}</DialogTitle>
          <DialogContent>
            <label>Start Date</label>
            <TextField
              fullWidth
              margin="dense"
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate}
            />
            <label>End Date</label>
            <TextField
              fullWidth
              margin="dense"
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate}
            />
            <label>Partial Days</label>
            <FormControl fullWidth margin="dense">
              <Select
                id="partialDays"
                name="partialDays"
                value={formData.partialDays}
                onChange={handleChange}
                error={Boolean(errors.partialDays)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="halfday">Half Day</MenuItem>
                <MenuItem value="fullday">Full Day</MenuItem>
              </Select>
              {errors.partialDays && (
                <p className="error-message">{errors.partialDays}</p>
              )}
            </FormControl>
            <label>Type</label>
            <FormControl fullWidth margin="dense">
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                error={Boolean(errors.type)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="sick">Sick</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
              {errors.type && <p className="error-message">{errors.type}</p>}
            </FormControl>
            <label>Reason</label>
            <TextField
              fullWidth
              margin="dense"
              id="reason"
              name="reason"
              label="Reason"
              value={formData.reason}
              onChange={handleChange}
              error={Boolean(errors.reason)}
              helperText={errors.reason}
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <div className="form-button-employee">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button-employee"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button-employee"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Save"}
              </button>
            </div>
          </DialogActions>
          <ToastContainer />
        </form>
      </div>
    </Dialog>
  );
};

export default AssestAdmin;

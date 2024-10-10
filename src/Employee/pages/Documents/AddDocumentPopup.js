import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { AddDocumentValidation } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import "./AddDocumentPopup.css";
import { DocumentUpload } from "../../EmpApiServices";
import { useSelector } from "react-redux";

const AddDocumentPopup = ({ open, onClose }) => {
  const { employeeName, employeeId } = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    employeeName: employeeName,
    employeeId:employeeId ,
    documentType: "",
    uploadedDate: "",
    uploadStatus: "",
    documentUrl: null,
    verifyStatus: "PENDING",
  });
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    // File type validation
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        documentFile:
          "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
      }));
      setDragging(false);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      documentFile: file,
    }));
    setDragging(false);
    setErrors((prevErrors) => ({ ...prevErrors, documentFile: null }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddDocumentValidation.validate(formData, { abortEarly: false });
      setErrors({});
      
      const formDataToSend = new FormData();
      formDataToSend.append("employeeName", formData.employeeName);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("documentType", formData.documentType);
      formDataToSend.append("uploadedDate", formData.uploadedDate);
      formDataToSend.append("uploadStatus", formData.uploadStatus);
      formDataToSend.append("verifyStatus", formData.verifyStatus);
      
      if (formData.documentUrl) {
        formDataToSend.append("documentUrl", formData.documentUrl);
      }
      
      const response = await DocumentUpload(formDataToSend);
      onClose();
      console.log(response.data);
      toast.success("Document sent successfully");
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        const errorMessage =
          err.response.data.error || "An unexpected error occurred";
        toast.error(errorMessage);
      } else if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill in the required fields.");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: "dialog" }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            id="employeeName"
            name="employeeName"
            label="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            error={Boolean(errors.employeeName)}
            helperText={errors.employeeName}
          />
          <TextField
            fullWidth
            margin="dense"
            id="employeeId"
            name="employeeId"
            label="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            error={Boolean(errors.employeeId)}
            helperText={errors.employeeId}
          />
          <FormControl fullWidth margin="dense" error={Boolean(errors.documentType)}>
        <InputLabel >Document Type</InputLabel>
        <Select
          label="documentType-label"
          id="documentType"
          name="documentType"
          value={formData.documentName}
          onChange={handleChange}
        >
          <MenuItem value="aadharCard">Aadhar Card</MenuItem>
          <MenuItem value="panCard">Pan Card</MenuItem>
          <MenuItem value="address">Address</MenuItem>
          <MenuItem value="waterIdCard">Water ID Card</MenuItem>
        </Select>
        {errors.documentType && <FormHelperText>{errors.documentType}</FormHelperText>}
      </FormControl>
          <TextField
            fullWidth
            margin="dense"
            id="uploadedDate"
            name="uploadedDate"
            label="Upload Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.uploadedDate}
            onChange={handleChange}
            error={Boolean(errors.uploadedDate)}
            helperText={errors.uploadedDate}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>uploadStatus</InputLabel>
            <Select
              id="uploadStatus"
              name="uploadStatus"
              label="uploadStatus"
              value={formData.uploadStatus}
              onChange={handleChange}
            >
              <MenuItem value="Upload">
                <IconMapper
                  iconName="UploadIcon"
                  style={{ width: "25px", marginRight: "8px" }}
                />
              </MenuItem>
              <MenuItem value="Not Upload">
                <IconMapper
                  iconName="Close"
                  style={{ width: "25px", marginRight: "8px" }}
                />
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            id="verifyStatus"
            name="verifyStatus"
            label="verifyStatus"
            type="text"
            InputLabelProps={{ shrink: true }}
            value={formData.verifyStatus}
            onChange={handleChange}
            error={Boolean(errors.verifyStatus)}
            helperText={errors.verifyStatus}
          />
          <div
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="icon-wrapper">
              <IconMapper style={{ width: "15%" }} iconName={"UploadFile"} />
            </div>
            <p>Drag and drop Files Here to Upload</p>
            <label htmlFor="file-upload" className="uploadfilebutton">
              Upload File
              <input
                id="file-upload"
                type="file"
                name="documentUrl"
                onChange={handleChange}
                style={{ display: "none" }} // Hide the actual input element
              />
            </label>
          </div>

          {errors.documentUrl && (
            <div style={{ color: "red" }}>{errors.documentUrl}</div>
          )}
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
            <button type="submit" className="save-button-employee">
              Save
            </button>
          </div>
        </DialogActions>
        <ToastContainer />
      </form>
    </Dialog>
  );
};

export default AddDocumentPopup;

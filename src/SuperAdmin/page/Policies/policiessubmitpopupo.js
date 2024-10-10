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
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { PloiciesSuperValidation } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import "./policiessubmitpopupo.css"; // Import the CSS file
import {  policies } from "../../ApiServices";

const AddDocumentPopup = ({ open, onClose, fetchPoliciesDatas }) => {
  const [formData, setFormData] = useState({
    policyName: "",
    uploadDate: "",
    current: "",
    fileName: null,
    description: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));

    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        policyName: files[0].name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await PloiciesSuperValidation.validate(formData, { abortEarly: false });
      setErrors({});
      const formDataToSend = new FormData();
      formDataToSend.append("policyName", formData.policyName);
      formDataToSend.append("uploadDate", formData.uploadDate);
      formDataToSend.append("current", formData.current);
      formDataToSend.append("description", formData.description);
      await policies(formDataToSend);
      toast.success("Policies sent successfully");
      setTimeout(async()=>{
        onClose();
      await   fetchPoliciesDatas();
      },3000)
     
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
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: "dialog" }}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" align="center">
            Add New Policies
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                id="policyName"
                name="policyName"
                label="Policies Name"
                value={formData.policyName}
                onChange={handleChange}
                error={Boolean(errors.policyName)}
                helperText={errors.policyName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                id="uploadDate"
                name="uploadDate"
                label="Upload Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.uploadDate}
                onChange={handleChange}
                error={Boolean(errors.uploadDate)}
                helperText={errors.uploadDate}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Current</InputLabel>
                <Select
                  id="current"
                  name="current"
                  label="current"
                  value={formData.current}
                  onChange={handleChange}
                  error={Boolean(errors.current)}
                >
                  <MenuItem value="True">True</MenuItem>
                  <MenuItem value="False">False</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="dropzone">
                <div className="icon-wrapper">
                  <IconMapper icon="upload" className="upload-icon" />
                </div>
                <Typography variant="body2" color="textSecondary">
                  Drag and drop a file or click to select
                </Typography>
                <Button className="uploadfilebutton" component="label">
                  Upload File
                  <input
                    type="file"
                    name="fileName"
                    onChange={handleChange}
                    hidden
                  />
                </Button>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div className="form-button-employee">
            <Button
              onClick={onClose}
              className="cancel-button-employee"
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="save-button-employee"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </div>
        </DialogActions>
        <ToastContainer />
      </form>
    </Dialog>
  );
};

export default AddDocumentPopup;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { AddExpensesValidation } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ExpensePopup.css";
import { submitExpenseRequest } from "../../EmpApiServices";
import { useSelector } from "react-redux";
import IconMapper from "../../../components/IconMapper/IconMapper";

const AddDocumentPopup = ({ open, onClose,loadExpenses }) => {
  const { employeeName, employeeId } = useSelector((state) => state.auth.user);
  const {  jwtToken } = useSelector((state) => state.auth.token);
  const [formData, setFormData] = useState({
    employeeName: employeeName,
    employeeId: employeeId,
    expenseDate: "",
    expenseDescription: "",
    expenseType: "",
    amount: "",
    receiptFileName: "",
    status: "PENDING",
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
        receiptFileName: files[0].name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddExpensesValidation.validate(formData, { abortEarly: false });
      setErrors({});

      const formDataToSend = new FormData();
      formDataToSend.append("employeeName", formData.employeeName);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("expenseDate", formData.expenseDate);
      formDataToSend.append("expenseDescription", formData.expenseDescription);
      formDataToSend.append("expenseType", formData.expenseType);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("receiptFileName", formData.receiptFileName);
      formDataToSend.append("status", formData.status);
      await submitExpenseRequest(formDataToSend,jwtToken);
      setFormData({
        employeeName: '',
        employeeId: '',
        expenseDate: '',
        expenseDescription: '',
        expenseType: '',
        amount: '',
        receiptFileName: '',
        status: '',
      });
      setTimeout(async()=>{
        onClose();
       await loadExpenses()
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
    <Dialog open={open} onClose={onClose} classes={{ paper: "dialog" }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            id="employeeName"
            name="employeeName"
            label="Employee Name"
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

          <TextField
            fullWidth
            margin="dense"
            id="expenseDate"
            name="expenseDate"
            label="Expense Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.expenseDate}
            onChange={handleChange}
            error={Boolean(errors.expenseDate)}
            helperText={errors.expenseDate}
          />

          <TextField
            fullWidth
            margin="dense"
            id="expenseDescription"
            name="expenseDescription"
            label="Expense Description"
            value={formData.expenseDescription}
            onChange={handleChange}
            error={Boolean(errors.expenseDescription)}
            helperText={errors.expenseDescription}
          />

          <TextField
            fullWidth
            margin="dense"
            id="expenseType"
            name="expenseType"
            label="Expense Type"
            value={formData.expenseType}
            onChange={handleChange}
            error={Boolean(errors.expenseType)}
            helperText={errors.expenseType}
          />

          <TextField
            fullWidth
            margin="dense"
            id="amount"
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleChange}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
          />

          <TextField
            fullWidth
            margin="dense"
            id="status"
            name="status"
            label="Status"
            type="text"
            InputLabelProps={{ shrink: true }}
            value={formData.status}
            onChange={handleChange}
            error={Boolean(errors.status)}
            helperText={errors.status}
          />
          <div className="dropzone">
            <div className="icon-wrapper">
              <IconMapper
                style={{ width: "15%" }}
                className="uploadfilecolor"
                iconName={"UploadFile"}
              />
            </div>
            <p> Image Here to Upload</p>
            <label htmlFor="receiptFileName" className="uploadfilebutton">
              Upload Image
              <input
                id="receiptFileName"
                type="file"
                name="receiptFileName"
                onChange={handleChange}
              />
            </label>
          </div>
          {formData.receiptFileName && (
            <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
              File: {formData.receiptFileName}
            </div>
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

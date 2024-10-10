import React, { useState, useEffect } from "react";
import "./SuperAdminExpenses.css";
import Header from "../../../Employee/components/Navbar/Navbar";
// import Checkbox from "@mui/material/Checkbox";
import { TablePagination } from "@mui/material";
import CommonHeader from "../../../components/CommonHeader/index";
import DownloadButton from "../../../Employee/components/DownloadButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import {
  fetchAllExpenseData,
  approveExpense,
  rejectExpense,
} from "../../ApiServices";
// import IconMapper from "../../../components/IconMapper/IconMapper";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";


const profileImage = "/assets/images/profile.jpg";
const ITEMS_PER_PAGE = 6;

const AdminExpense = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllExpenseData();
        setAllDocuments(data);
        setFilteredDocuments(data);
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let documentsToDisplay = allDocuments;

    if (searchTerm) {
      documentsToDisplay = documentsToDisplay.filter(
        (doc) =>
          (doc.employeeName &&
            doc.employeeName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (doc.expenseType &&
            doc.expenseType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      documentsToDisplay = documentsToDisplay.filter(
        (doc) => doc.status === statusFilter
      );
    }

    documentsToDisplay = documentsToDisplay.filter((doc) => {
      const appliedDate = new Date(doc.expenseDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : new Date();

      if (from) {
        return appliedDate >= from && appliedDate <= to;
      }
      return true;
    });

    setFilteredDocuments(documentsToDisplay);
  }, [searchTerm, statusFilter, fromDate, toDate, allDocuments]);

  const currentDocuments = filteredDocuments.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(currentDocuments.map((doc) => doc.expenseId));
    } else {
      setSelectedDocuments([]);
    }
  };

  // const handleSelectDocument = (expenseId) => {
  //   setSelectedDocuments((prev) =>
  //     prev.includes(expenseId) ? prev.filter((item) => item !== expenseId) : [...prev, expenseId]
  //   );
  // };

  const handleDeleteSelected = () => {
    const newFilteredDocuments = filteredDocuments.filter(
      (doc) => !selectedDocuments.includes(doc.expenseId)
    );
    setFilteredDocuments(newFilteredDocuments);
    setSelectedDocuments([]);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setStatusFilter("all");
    setSelectedDocuments([]);
    setCurrentPage(0);
    setFilteredDocuments(allDocuments);
  };

  const handleOpenDialog = (doc) => {
    setSelectedDoc(doc);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDoc(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === "Approved") {
        await approveExpense(selectedDoc.expenseId);
      } else {
        await rejectExpense(selectedDoc.expenseId);
      }

      const updatedDocuments = filteredDocuments.map((doc) =>
        doc.expenseId === selectedDoc.expenseId
          ? { ...doc, status: newStatus }
          : doc
      );

      setFilteredDocuments(updatedDocuments);
      toast.success("Status updated successfully!");
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status: " + error.message);
    }
  };

  return (
    <div>
      <Header
        siteName={"Expense"}
        profileImage={profileImage}
        showLinks={["expenses"]}
      />
      <div className="SuperAdminExpenses-table-container">
        <CommonHeader
          title="Expense Management"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteSelected={handleDeleteSelected}
          selectedDocuments={selectedDocuments}
          currentDocuments={currentDocuments}
          handleSelectAll={handleSelectAll}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
          showStatusFilter={true}
          showCalendor={true}
          showCheckbox={true}
          showIcons={{ plus: false, trash: true, rotate: true }}
          handleAddClick={() => alert("Add Expense Clicked")}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          handleResetFilters={handleResetFilters}
          showSearchFilter={true}
        />
         {loading ? (
          <LinearIndeterminate />
        ) : (
        <div className="SuperAdminExpenses-tablebody">
          <table className="SuperAdminExpenses-table-data">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Expense Date</th>
                <th>Amount</th>
                <th>Expense Type</th>
                <th> Description</th>
                <th>Receipt File</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.expenseId}</td>
                  <td>{doc.employeeName}</td>
                  <td>{doc.employeeId}</td>
                  <td>{doc.expenseDate}</td>
                  <td>{doc.amount}</td>
                  <td>{doc.expenseType}</td>
                  <td data-label="Description">
                    <div className="SuperAdminExpenses-tooltip">
                      {doc.expenseDescription?.length > 5
                        ? doc.expenseDescription.slice(0, 5) + "..."
                        : doc.expenseDescription}
                      <span className="SuperAdminExpenses-tooltip-text">
                        {doc.expenseDescription}
                      </span>
                    </div>
                  </td>
                  <td>{doc.receiptFileName}</td>
                  <td
                    onClick={() => handleOpenDialog(doc)}
                    className={
                      doc.status === "Approved"
                        ? "status-approved"
                        : doc.status === "Rejected"
                        ? "status-rejected"
                        : doc.status === "Pending"
                        ? "status-Pending"
                        : ""
                    }
                  >
                    {doc.status}
                    <IconButton>{/* <ArrowDropDownIcon /> */}</IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="SuperAdminExpenses-pagination-table-container">
            <DownloadButton
              onClick={() => alert("Download")}
              className="SuperAdminExpensesdownload-button-table-data"
            />
            
            <TablePagination
              component="div"
              count={filteredDocuments.length}
              page={currentPage}
              onPageChange={handlePageChange}
              rowsPerPage={itemsPerPage}
              rowsPerPageOptions={[6, 10, 20]}
              onRowsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
        )}{" "}

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>
            Change Status for {selectedDoc?.employeeName}
          </DialogTitle>
          <DialogContent>
            <p>Expense ID: {selectedDoc?.expenseId}</p>
            <p>Select status:</p>
            <Button onClick={() => handleStatusChange("Approved")}>
              Approved
            </Button>
            <Button onClick={() => handleStatusChange("Pending")}>
              Pending
            </Button>
            <Button onClick={() => handleStatusChange("Rejected")}>
              Rejected
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminExpense;

import React, { useState, useEffect, useMemo } from "react";
import "../../../components/css/Table.css";
import Header from "../../../Employee/components/Navbar/Navbar";
import Checkbox from "@mui/material/Checkbox";
import {
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import CommonHeader from "../../../components/CommonHeader/index";
import DownloadButton from "../../../Employee/components/DownloadButton";
import { approveTimeOff, fetchalltimeoff, rejectTimeOff } from "../../ApiServices";
import { toast } from "react-toastify";
import "./SuperAdminTimeOff.css";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";

const profileImage = "/assets/images/profile.jpg";

const AdminTimeOff = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange] = useState({ fromDate: "", toDate: "" });
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTimeOffRequests = async () => {
    setLoading(true); 
    try {
      const data = await fetchalltimeoff();
      setFilteredDocuments(data);
    } catch (error) {
      toast.error("Error loading data: " + error.message);
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
   
    loadTimeOffRequests();
  }, []);

  // Memoized filtered documents to improve performance
  const filteredData = useMemo(() => {
    return filteredDocuments
      .filter(doc => searchTerm ? doc.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      .filter(doc => statusFilter ? doc.status === statusFilter : true)
      .filter(doc => {
        const startDates = new Date(doc.startDate);
        const from = dateRange.fromDate ? new Date(dateRange.fromDate) : null;
        const to = dateRange.toDate ? new Date(dateRange.toDate) : new Date();
        return !from || (startDates >= from && startDates <= to);
      });
  }, [filteredDocuments, searchTerm, statusFilter, dateRange]);

  const currentDocuments = filteredData.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage);

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleSelectAll = (event) => {
    setSelectedDocuments(event.target.checked ? currentDocuments.map(doc => doc.leaveId) : []);
  };

  const handleSelectDocument = (id) => {
    setSelectedDocuments(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleDeleteSelected = () => {
    setFilteredDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.leaveId)));
    setSelectedDocuments([]);
    setCurrentPage(0);
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
      const result = newStatus === "Approved"
        ? await approveTimeOff(selectedDoc.leaveId)
        : await rejectTimeOff(selectedDoc.leaveId);

      if (result) {
        setFilteredDocuments(prev =>
          prev.map(doc => doc.leaveId === selectedDoc.leaveId ? { ...doc, status: newStatus } : doc)
        );
        toast.success("Status updated successfully!");
      }
      handleCloseDialog();
    } catch (error) {
      toast.error("Error updating status: " + error.message);
    }
  };

  return (
    <div>
      <Header siteName="Time Off-Book" profileImage={profileImage} showLinks={["timeoff"]} />
      <div className="timeoff-table-container">
        <CommonHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteSelected={handleDeleteSelected}
          selectedPayslips={selectedDocuments}
          showIcons={{ plus: false, trash: true, rotate: true }}
          selectedDocuments={selectedDocuments}
          currentDocuments={currentDocuments}
          handleSelectAll={handleSelectAll}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showStatusFilter={true}
          showCalendar={true}
          showSearchFilter={true}

        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="timeoff-tablebody">
            <table className="timeoff-table-data">
              <thead>
                <tr>
                  <th >
                    <Checkbox
                      checked={selectedDocuments.length === currentDocuments.length && currentDocuments.length > 0}
                      indeterminate={selectedDocuments.length > 0 && selectedDocuments.length < currentDocuments.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Leave ID</th>
                  <th>Employee ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Partial Days</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentDocuments.map(doc => (
                  <tr key={doc.leaveId}>
                    <td style={{ padding: "5px", textAlign: "center" }}>
                      <Checkbox
                        checked={selectedDocuments.includes(doc.leaveId)}
                        onChange={() => handleSelectDocument(doc.leaveId)}
                      />
                    </td>
                    <td>{doc.leaveId}</td>
                    <td>{doc.employeeId}</td>
                    <td>{doc.startDate}</td>
                    <td>{doc.endDate}</td>
                    <td>{doc.partialDays}</td>
                    <td>{doc.type}</td>
                    <td
                      className={`status-${doc.status.toLowerCase()}`}
                      onClick={() => handleOpenDialog(doc)}
                      style={{ cursor: 'pointer' }}
                    >
                      {doc.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="timeoff-pagination-table-container">
              <DownloadButton
                onClick={() => alert("Download")}
                className="timeoff-download-button-table-data"
              />
              <div className="flex gap-3">
                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={currentPage}
                  onPageChange={handlePageChange}
                  rowsPerPage={itemsPerPage}
                  rowsPerPageOptions={[6, 10, 20]}
                  onRowsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          </div>
              )}{" "}

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Change Status for {selectedDoc?.employeeId}</DialogTitle>
          <DialogContent>
            <p>Leave ID: {selectedDoc?.leaveId}</p>
            <p>Select status:</p>
            <Button onClick={() => handleStatusChange("Approved")}>APPROVED</Button>
            <Button onClick={() => handleStatusChange("Pending")}>PENDING</Button>
            <Button onClick={() => handleStatusChange("Rejected")}>REJECTED</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminTimeOff;

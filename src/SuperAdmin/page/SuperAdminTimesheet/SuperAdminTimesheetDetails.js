import React, { useState, useEffect } from "react";
import "./admintimesheetpopup.css";
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import { Link, useParams } from "react-router-dom";
import {
  getAllTimesheets,
  approveTimesheet,
  rejectTimesheet,
} from "../../ApiServices";
import { toast, ToastContainer } from "react-toastify";
import CommonHeader from "../../../components/CommonHeader";
import TablePagination from "@mui/material/TablePagination";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";

const ITEMS_PER_PAGE = 6;

const AdminTimesheet = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [page, setPage] = useState(0); // State to track the current page
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE); // State to track rows per page
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const { employeeId } = useParams();

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const data = await getAllTimesheets();
      setTimesheetData(data);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTimesheets();
  }, []);

  // Filter timesheets by employeeId and paginate
  useEffect(() => {
    let filteredData = timesheetData;

    if (employeeId) {
      filteredData = timesheetData.filter(
        (timesheet) => timesheet.employeeId === employeeId
      );
    }

    const newOffset = page * rowsPerPage;
    setCurrentItems(filteredData.slice(newOffset, newOffset + rowsPerPage));
  }, [page, rowsPerPage, timesheetData, employeeId]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === "Approved") {
        await approveTimesheet(selectedDoc.timesheetId);
      } else {
        await rejectTimesheet(selectedDoc.timesheetId);
      }
      const updatedTimesheets = timesheetData.map((timesheet) =>
        timesheet.timesheetId === selectedDoc.timesheetId
          ? { ...timesheet, status: newStatus }
          : timesheet
      );

      setTimesheetData(updatedTimesheets);
      toast.success(`Status updated to ${newStatus}!`);
      setPopupVisible(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status: " + error.message);
    }
  };

  const Popup = ({ visible, children }) => {
    if (!visible) return null;
    return (
      <div className="dropdown-popup">
        <div className="dropdown-popup-content">{children}</div>
      </div>
    );
  };

  const profileImage = "/assets/images/profile.jpg";

  return (
    <div>
      <Header
        siteName={"Timesheet"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["timesheet"]}
      />
      <div>
        <div className="table-container">
          <CommonHeader
            showSearchFilter={true}
            showIcons={{ plus: false, trash: false, rotate: true }}
          />
          {loading ? (
            <LinearIndeterminate />
          ) : (
            <div className="super-timesheet-tablebody">
              <table className="super-timesheet-table-data">
                <thead>
                  <tr>
                    <th>Timesheet ID</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>InDate</th>
                    <th>InTimeHH</th>
                    <th>InTimeMM</th>
                    <th>InPeriod</th>
                    <th>OutDate</th>
                    <th>OutTimeHH</th>
                    <th>OutTimeMM</th>
                    <th>OutPeriod</th>
                    <th>Hours</th>
                    <th>PresentStatus</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((timesheet) => (
                    <tr key={timesheet._id}>
                      <td data-label="TimesheetId">{timesheet.timesheetId}</td>
                      <td>
                        <Link
                          to={`/superadmin/timesheets/${timesheet.employeeId}`}
                        >
                          {timesheet.employeeId}
                        </Link>
                      </td>
                      <td data-label="EmployeeName">
                        {timesheet.employeeName}
                      </td>
                      <td data-label="InDate">{timesheet.inDate}</td>
                      <td data-label="InTimeHH">{timesheet.inTimeHH}</td>
                      <td data-label="InTimeMM">{timesheet.inTimeMM}</td>
                      <td data-label="InPeriod">{timesheet.inPeriod}</td>
                      <td data-label="OutDate">{timesheet.outDate}</td>
                      <td data-label="OutTimeHH">{timesheet.outTimeHH}</td>
                      <td data-label="OutTimeMM">{timesheet.outTimeMM}</td>
                      <td data-label="OutPeriod">{timesheet.outPeriod}</td>
                      <td data-label="Hours">{timesheet.hours}</td>
                      <td data-label="PresentStatus">
                        {timesheet.attendanceStatus}
                      </td>
                      <td
                        data-label="Status"
                        style={{ cursor: "pointer" }}
                        className={
                          timesheet.status === "Approved"
                            ? "status-approved"
                            : timesheet.status === "Rejected"
                            ? "status-rejected"
                            : timesheet.status === "Pending"
                            ? "status-Pending"
                            : ""
                        }
                        onClick={() => {
                          setSelectedDoc(timesheet);
                          setPopupVisible(true);
                        }}
                      >
                        {timesheet.status}
                      </td>
                      <td data-label="Dropdown">
                        <Popup visible={popupVisible}>
                          <ul className="dropdown-menu">
                            <li
                              style={{ cursor: "pointer" }}
                              className="accept-dropdown-menu"
                              onClick={() => handleStatusChange("Approved")}
                            >
                              Approved
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="pending-dropdown-menu"
                              onClick={() => handleStatusChange("Pending")}
                            >
                              Pending
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="reject-dropdown-menu"
                              onClick={() => handleStatusChange("Rejected")}
                            >
                              Rejected
                            </li>
                          </ul>
                        </Popup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}{" "}
          <TablePagination
            component="div"
            count={timesheetData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AdminTimesheet;

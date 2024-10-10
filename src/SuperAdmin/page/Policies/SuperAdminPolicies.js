
import React, { useState, useEffect } from "react";
import './SuperAdminPolicies.css';
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import CommonHeader from "../../../components/CommonHeader/index";
import { fetchPoliciesDatas } from "../../ApiServices"; // Import your API function
import DownloadButton from "../../../Employee/components/DownloadButton";
import Policiesssubmitpopup from '../Policies/policiessubmitpopupo'
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";

const ITEMS_PER_PAGE = 6;

const Polices = () => {
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [allPolicies, setAllPolicies] = useState([]); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const policiesData = await fetchPoliciesDatas(); // Fetch the data using the API
      setAllPolicies(policiesData); // Save policies to the state
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
   
    fetchPolicies();
  }, []);

  // Filter and paginate data based on search query, page, and rows per page
  useEffect(() => {
    const filteredData = allPolicies.filter((document) =>
      document.policyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const newOffset = page * rowsPerPage;
    setCurrentItems(filteredData.slice(newOffset, newOffset + rowsPerPage));
  }, [searchQuery, page, rowsPerPage, allPolicies]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectDocuments = (name) => {
    setSelectedPolicies((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleSelectAll = (event) => {
    setIsSelectAllChecked(event.target.checked);
    if (event.target.checked) {
      setSelectedPolicies(currentItems.map((item) => item.policyName));
    } else {
      setSelectedPolicies([]);
    }
  };

  const handleDownload = () => {
    if (selectedPolicies.length === 0) {
      alert("Please select at least one document to download.");
      return;
    }
    const selectedData = allPolicies.filter((document) =>
      selectedPolicies.includes(document.policyName)
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Upload Date"]
        .concat(selectedData.map((item) => `${item.policyName},${item.uploadDate}`))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "documents.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Downloading...");
    console.log("Downloading:", selectedPolicies);
  };

  const handleDelete = () => {
    if (selectedPolicies.length === 0) {
      alert("Please select at least one document to delete.");
      return;
    }
    const updatedDocuments = allPolicies.filter(
      (document) => !selectedPolicies.includes(document.policyName)
    );
    setSelectedPolicies([]);
    setCurrentItems(updatedDocuments.slice(0, rowsPerPage));
    setAllPolicies(updatedDocuments); // Update the main state as well
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleFormSubmit = (data) => {
    console.log("Form Submitted", data);
    setIsPopupOpen(false);
  };
  const handleAddClick = () => {
    setIsPopupOpen(true);
  }

  const profileImage = "/assets/images/profile.jpg";

  return (
    <div>
      <Header
        siteName={"Organisation Policies & Procedures"}
        userName={"Arj"}
        profileImage={profileImage}
        showLinks={["policies"]}
      />
      <div className="Policies-table-container">
        <CommonHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          selectedPayslips={selectedPolicies}
          handleDeleteSelected={handleDelete}
          showIcons={{ plus: true, trash: true, rotate: true, PdfIcon: false }}
          handleSelectAll={handleSelectAll}
          currentDocuments={currentItems}
          selectedDocuments={selectedPolicies}
          handleAddClick={handleAddClick}
          showSearchFilter={true}
        />
         {loading ? (
          <LinearIndeterminate />
        ) : (
        <div className="Policies-tablebody">
          <table className="Policies-table-data">
            <thead>
              <tr>
                <th style={{ padding: "5px" }}>
                  <Checkbox
                    checked={isSelectAllChecked}
                    indeterminate={
                      selectedPolicies.length > 0 &&
                      selectedPolicies.length < currentItems.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                {/* <th>Policy Id</th> */}
                <th>Policy Name</th>
                <th>FileName</th>
                <th>Current</th>
                <th>Description</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((doc) => (
                <tr key={doc.policyId}>
                  <td
                    // className="w-[10px]"
                    style={{ padding: "5px", textAlign: "left" }}
                  >
                    <Checkbox
                      checked={selectedPolicies.includes(doc.policyName)}
                      onChange={() => handleSelectDocuments(doc.policyName)}
                    />
                  </td>
                  {/* <td>{doc.policyId}</td> */}
                  <td data-label="Document Name">{doc.policyName}</td>
                  <td> {doc.fileName}</td>
                  <td>{doc.current ? "True" : "False"}</td>
                 <td data-label="Description">
                    <div className="Policies-tooltip">
                      {doc.description?.length > 5
                        ? doc.description.slice(0, 5) + "..."
                        : doc.description}
                      <span className="Policies-tooltip-text">{doc.description}</span>
                    </div>
                  </td>
                  <td style={{ paddingRight: "95px" }} data-label="Upload Date">
                    {doc.uploadDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="Policies-pagination-table-container">
            <DownloadButton
              onClick={handleDownload}
              className="Policies-download-button-table-data"
            />
            
            <TablePagination
              rowsPerPageOptions={[ITEMS_PER_PAGE, 10, 25]}
              component="div"
              count={allPolicies.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
          
          <Policiesssubmitpopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleFormSubmit}
        fetchPoliciesDatas={fetchPoliciesDatas}
      />
      
        </div>
         )}{" "}
      </div>
    </div>
  );
};

export default Polices;

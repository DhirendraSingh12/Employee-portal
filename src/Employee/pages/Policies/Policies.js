
import React, { useState, useEffect } from "react";
import './Policies.css';
import Header from "../../components/Navbar/Navbar";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import DownloadButton from "../../components/DownloadButton/index";
import CommonHeader from "../../../components/CommonHeader/index";
import { fetchPoliciesDatas } from "../../EmpApiServices"; // Import your API function
import LinearIndeterminate from '../../../components/Linearindeterminate/Linearindeterminate'

const ITEMS_PER_PAGE = 6;

const Polices = () => {
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [allPolicies, setAllPolicies] = useState([]); // Store all fetched policies
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    setLoading(true); 

    try {
      const policiesData = await fetchPoliciesDatas(); 
      setAllPolicies(policiesData);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false); 
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
  const handleRefreshClick = () => {
    fetchPolicies();
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
          showIcons={{ plus: false, trash: true, rotate: true, PdfIcon: false }}
          handleSelectAll={handleSelectAll}
          currentDocuments={currentItems}
          selectedDocuments={selectedPolicies}
          handleRefreshClick={handleRefreshClick}
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
                <th>Document Name</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((doc) => (
                <tr key={doc.policyId}>
                  <td
                    className="w-[10px]"
                    style={{ padding: "5px", textAlign: "left" }}
                  >
                    <Checkbox
                      checked={selectedPolicies.includes(doc.policyName)}
                      onChange={() => handleSelectDocuments(doc.policyName)}
                    />
                  </td>
                  <td data-label="Document Name">{doc.policyName}</td>
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
        </div>
                        )}{" "}

      </div>
    </div>
  );
};

export default Polices;

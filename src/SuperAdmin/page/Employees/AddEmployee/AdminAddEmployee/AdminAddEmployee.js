import React, { useState } from "react";
import "./AdminAddEmployee.css";
import CommonHeader from "../../../../../components/CommonHeader/index";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DynamicButton from "../../../../../components/DynamicButton/DynamicButton";

// src/Admin/pages/AdminAddEmployee/teamsData.js
export const team = [
    // {
    //     id: 1,
    //     name: "Nagarjun Danda",
    //     role: "Director",
    //     profileLink: "/view-profile/1",
    //     status: "Working from home",
    //     image: "/assets/images/profile.jpg",
    //     email: "nagarjun@example.com",
    //     phone: "+123456789",
    //     teamName: "Management",
    //     reports: 3,
    // },
    // {
    //     id: 2,
    //     name: "Nandini Rao",
    //     role: "Senior Test Analyst - Consultant",
    //     profileLink: "/view-profile/2",
    //     status: "Working from home",
    //     image: "/assets/images/profile.jpg",
    //     email: "nandini@example.com",
    //     phone: "+987654321",
    //     teamName: "Testing",
    //     reports: 5,
    // },
    // {
    //     id: 3,
    //     name: "Shambuprasad Thota",
    //     role: "Client Account Manager",
    //     profileLink: "/view-profile/3",
    //     status: "In Office",
    //     image: "/assets/images/profile.jpg",
    //     email: "shambu@example.com",
    //     phone: "+192837465",
    //     teamName: "Client Management",
    //     reports: 2,
    // },
];

const AddAdminEmployee = () => {
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleVisibilityClick = (teamMember) => {
        setSelectedTeamMember(teamMember);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedTeamMember(null);
    };

    return (
        <div className="admin-add-employee">
            <div className="emp-content-container">
                <CommonHeader showIcons={{ plus: false, trash: true, rotate: true }}
                showSearchFilter={true} />

                <div className="emp-actions-container">
                <DynamicButton
        text="Add Employee"
        link="/superadmin/empdetails" 
        height="40px"
        width="250px"
        backgroundColor="#6674a9" 
        color="#ffffff" 
      />
                </div>

<div className="emp-filters-container">
      <FormControl fullWidth margin="normal">
        <TextField
          id="emp-name-job"
          label="Find"
          placeholder="Name, job title"
          variant="outlined"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="emp-filter-status-label">Filter by</InputLabel>
        <Select
          labelId="emp-filter-status-label"
          id="emp-filter-status"
          label="Filter by"
        >
          <MenuItem value="team1">Team 1</MenuItem>
          <MenuItem value="team2">Team 2</MenuItem>
          <MenuItem value="team3">Team 3</MenuItem>
          <MenuItem value="no-team">No Team</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="emp-sort-name-label">Sort by</InputLabel>
        <Select
          labelId="emp-sort-name-label"
          id="emp-sort-name"
          label="Sort by"
        >
          <MenuItem value="az">First name (A - Z)</MenuItem>
          <MenuItem value="za">Last name (A - Z)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="emp-status-label">Status</InputLabel>
        <Select
          labelId="emp-status-label"
          id="emp-status"
          label="Status"
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="in-office">In Office</MenuItem>
          <MenuItem value="remote">Working Remotely</MenuItem>
          <MenuItem value="home">Work From Home</MenuItem>
        </Select>
      </FormControl>
    </div>

                <div className="emp-teams-section">
                    <h2>All Employee</h2>
                    <div className="emp-team-profiles">
                        {team.map((teamMember) => (
                            <div key={teamMember.id} className="emp-team-card">
                                <div className="emp-team-profile">
                                    <img
                                        src={teamMember.image}
                                        alt={teamMember.name}
                                        className="emp-team-profile-img"
                                    />
                                    <div className="emp-team-info">
                                        <h3>{teamMember.name}</h3>
                                        <p className="emp-role">{teamMember.role}</p>
                                        <div className="emp-profile-actions">
                                            <div className="emp-view-profile-container">
                                                <Link
                                                    to={`/superadmin/personal-information/${teamMember.id}`}
                                                    className="emp-view-profile-link"
                                                >
                                                    View full profile
                                                </Link>
                                            </div>
                                            <VisibilityIcon
                                                onClick={() => handleVisibilityClick(teamMember)}
                                                className="visibility-icon"
                                            />
                                        </div>

                                        <p className="emp-status-text">{teamMember.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showPopup && selectedTeamMember && ( 
    <div className="emp-modal-overlay">
        <div className="emp-modal-content">
            <div className="emp-modal-header">
                <h2>Employee Quick View</h2>
                <CloseIcon onClick={closePopup} className="emp-modal-close-icon" />
            </div>
            <div className="emp-modal-body">
                <div className="emp-modal-left">
                    <img
                        src={selectedTeamMember.image}
                        alt={selectedTeamMember.name}
                        className="emp-modal-profile-img"
                    />
                </div>
                <div className="emp-modal-right">
                    <h3>{selectedTeamMember.name.split(" ")[0]} <br/>{selectedTeamMember.name.split(" ")[1]}</h3>
                    <p>{selectedTeamMember.role}</p>
                    <div className="emp-team-details">
                        <strong>Team: {selectedTeamMember.teamName}</strong>
                    </div>
                    <div className="emp-contact-details">
                        <h3>Contact {selectedTeamMember.name}</h3>
                        <p>
                            <EmailIcon className="icon"/>
                            Email:{" "}
                            <a href={`mailto:${selectedTeamMember.email}`} className="emp-contact-email">
                                {selectedTeamMember.email}
                            </a>
                        </p>
                        <p>
                            <PhoneIcon className="icon"/>
                            Phone: {selectedTeamMember.phone}
                        </p>
                    </div>
                    {/* <p className="emp-reports">
                        {selectedTeamMember.reports} reports to 0 people
                    </p> */}
                </div>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default AddAdminEmployee;

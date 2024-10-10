import React, { useState } from 'react';
import './PersonalInfo.css';
import { useParams } from 'react-router-dom';
import { team } from './AdminAddEmployee';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography, Grid, TextField, Button, FormControlLabel, Checkbox, MenuItem, Select, FormControl, TextareaAutosize } from '@mui/material';
import EmptyFolderIcon from '../../../../../components/assets/Icons/empty-folder.png';

const PersonalInfo = () => {
    const [activeBtn, setActiveBtn] = useState('absence');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMedicalOpen, setIsMedicalOpen] = useState(false);
    const [isPersonalOpen, setIsPersonalOpen] = useState(false);
    const [isContractAndAnnualLeaveInformation, setIsContractAndAnnualLeaveInformation] = useState(false);
    const [isEmploymentSummary, setIsEmploymentSummary] = useState(false);
    const [isRoleInformation, setIsRoleInformation] = useState(false)
    const [isSalaryInformation, setIsSalaryInformation] = useState(false)
    const [isPayrollInformation, setIsPayrollInformation] = useState(false)
    const [isBankDetail, setIsBankDetail] = useState(false)
    const [isNotes, setIsNotes] = useState(false)
    const [isSensitiveDetail, setIsSensitiveDetail] = useState(false)
    const [isTermination, setIsTermination] = useState(false)
    const [isDeleteEmployeeRecord, setIsDeleteEmployeeRecord] = useState(false)
    const [checkedA, setCheckedA] = React.useState(false);
    const [checkedB, setCheckedB] = React.useState(false);
    const [date, setDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [notes, setNotes] = useState('');
    const [isToggleOn, setIsToggleOn] = useState(false);
    const navigate = useNavigate();

    const [accordionOpen, setAccordionOpen] = useState({
        currentFuture: false,
        history: false,
        cancelled: false,
    });
    const [contractData, setContractData] = useState({
        entitlementUnit: 'Days',
        annualLeaveBalance: 28,
        employmentType: 'Fixed',
        contractStartDate: '01 Jan 2023',
        workingTimePattern: 'Mon-Fri 9-5',
        contractedHoursPerWeek: 35,
        annualLeaveYearStart: '01 January',
        minLeaveEntitlement: 28,
        workingLocation: 'Not set',
        publicHolidaysFor: 'England & Wales',
        employeeStartDate: '01 Jan 2023',
        lengthOfService: '1 years 9 months'
    });

    const [roleData, setRoleData] = useState({
        jobTitle: 'Director',
        contractType: 'Full-Time',
        team: 'ArjGlobal',
        probationRequired: 'No',
        noticePeriod: 'Not specified'
    });
    const { id } = useParams();
    const teamMember = team.find((member) => member.id === parseInt(id));
    const currentYear = new Date().getFullYear();
    const options = [10, 20, 30, 40, 50];

    if (!teamMember) {
        return <div className="error-message">Employee not found</div>;
    }

    const handleButtonClick = (btn) => {
        setActiveBtn(btn);
    };

    const toggleAccordion = (section) => {
        setAccordionOpen((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const AbsenceSummary = ({ title, occurrences, btnText, btnClass }) => (
        <div className="profile-absence-item">
            <p>{title}</p>
            <span>{occurrences}</span>
            <h3>occurrences</h3>
            <button className={btnClass}>{btnText}</button>
        </div>
    );

    const OvertimeSection = ({ title, items, btnText }) => (
        <div className="section">
            <h2>{title}</h2>
            <div className="overtime-details">
                {items.map((item, index) => (
                    <div key={index}>
                        <p>{item.label}</p>
                        <h3>{item.time}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
            {btnText && <button className="use-toil-btn">{btnText}</button>}
        </div>
    );

    const AccordionItem = ({ title, isOpen, onClick }) => (
        <div className="accordion-item">
            <button onClick={onClick} className="accordion-button">
                {title}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </button>
            {isOpen && <div className="accordion-content">No data</div>}
        </div>
    );



    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleMedicalInfo = () => {
        setIsMedicalOpen(!isMedicalOpen);
    };

    const togglePersonalInfo = () => {
        setIsPersonalOpen(!isPersonalOpen)
    };

    const toggleContractAndAnnualLeaveInformation = () => {
        setIsContractAndAnnualLeaveInformation(!isContractAndAnnualLeaveInformation);
    }

    const toggleEmploymentSummary = () => {
        setIsEmploymentSummary(!isEmploymentSummary);
    }

    const toggleRoleInformation = () => {
        setIsRoleInformation(!isRoleInformation);
    }

    const toggleSalaryInformation = () => {
        setIsSalaryInformation(!isSalaryInformation);
    }

    const togglePayrollInformation = () => {
        setIsPayrollInformation(!isPayrollInformation);
    }

    const toggleBankDetail = () => {
        setIsBankDetail(!isBankDetail);
    }

    const toggleNotes = () => {
        setIsNotes(!isNotes)
    }

    const toggleSensitiveDetail = () => {
        setIsSensitiveDetail(!isSensitiveDetail);
    }

    const toggleTermination = () => {
        setIsTermination(!isTermination);
    }

    const toggleDeleteEmployeeRecord = () => {
        setIsDeleteEmployeeRecord(!isDeleteEmployeeRecord)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Implement save logic here (e.g., send data to an API)
        setIsEditing(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name in contractData) {
            setContractData({
                ...contractData,
                [name]: value
            });
        } else if (name in roleData) {
            setRoleData({
                ...roleData,
                [name]: value
            });
        }
    };

    const handleChangeA = (event) => {
        setCheckedA(event.target.checked);
    };

    const handleChangeB = (event) => {
        setCheckedB(event.target.checked);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    return (
        <div className="personal-info-page">
            <div className="personal-info-container">
                <div className="personal-info-card">
                    <div className="personal-info-header">
                        <div className="personal-info-img-container">
                            <img src={teamMember.image} alt={teamMember.name} className="personal-info-img" />
                            <IconButton className="profile-delete-btn" aria-label="delete" color="error" style={{ marginLeft: '110px', marginTop: '-75px' }}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <div className="personal-info-details">
                            <h3 className="personal-info-name">{teamMember.name}</h3>
                            <p className="personal-info-role">{teamMember.role}</p>
                            <div className="personal-info-contact">
                                <p><MailOutlineIcon /> <a href={`mailto:${teamMember.email}`}>{teamMember.email}</a></p>
                                <p><PhoneOutlinedIcon /> <span>{teamMember.phone}</span></p>
                            </div>
                        </div>
                        <div className="personal-info-status-section">
                            <div className="personal-info-status">
                                <i className="fas fa-home"></i> Working from home
                            </div>
                            <button className="profile-edit-btn">Edit</button>
                            <button className="profile-clear-btn">Clear</button>
                        </div>
                    </div>
                </div>
                <div className="profile-tabs-container">
                    <ul className="profile-tabs">
                        <li className={`profile-tab ${activeBtn === 'absence' ? 'active' : ''}`} onClick={() => handleButtonClick('absence')}>Absence</li>
                        <li className={`profile-tab ${activeBtn === 'employment' ? 'active' : ''}`} onClick={() => handleButtonClick('employment')}>Employment</li>
                        <li className={`profile-tab ${activeBtn === 'overtime' ? 'active' : ''}`} onClick={() => handleButtonClick('overtime')}>Overtime</li>
                        <li className={`profile-tab ${activeBtn === 'personal' ? 'active' : ''}`} onClick={() => handleButtonClick('personal')}>Personal</li>
                        <li className={`profile-tab ${activeBtn === 'emergencies' ? 'active' : ''}`} onClick={() => handleButtonClick('emergencies')}>Emergencies</li>
                        <li className={`profile-tab ${activeBtn === 'documents' ? 'active' : ''}`} onClick={() => handleButtonClick('documents')}>Documents</li>
                    </ul>

                </div>

                {activeBtn === 'absence' && (
                    <div className="absence-section">
                        <div className="filter-section">
                            <select className="absence-filter">
                                <option>All absences</option>
                                <option>Annual leave</option>
                                <option>Lateness</option>
                                <option>Sickness</option>
                                <option>Furlough</option>
                                <option>Others</option>
                            </select>
                            <select className="leave-year-filter">
                                {[...Array(5)].map((_, index) => {
                                    const year = currentYear - 1 + index;
                                    return <option key={year}>{`01 Jan ${year} – 31 Dec ${year}`}</option>;
                                })}
                            </select>
                        </div>
                        <div className="absence-header-container">
                            <h1>All absences</h1></div>
                        <div className="profile-absence-summary">
                            <div className="profile-annual-leave">
                                <p>Annual leave to take</p>
                                <h2>20 / 28</h2>
                                <button className="profile-add-leave-btn">Add annual leave</button>
                            </div>
                            <div className="profile-absence-item">
                                <p>Sickness</p>
                                <span>0</span>
                                <h3>occurrences</h3>
                                <button className="profile-add-btn">Add</button>
                            </div>
                            <div className="profile-absence-item">
                                <p>Lateness</p>
                                <span>0</span>
                                <h3>occurrences</h3>
                                <button className="profile-list-btn">List</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeBtn === 'employment' && (
                    <div className="main-employment-container">
                        <div className="employment-container">
                            {/*Contract and annual leave information Dropdown */}
                            <div className="contact-info-section">
                                <div className="contact-header" onClick={toggleContractAndAnnualLeaveInformation}>
                                    <span>Contract and annual leave information</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isContractAndAnnualLeaveInformation ? 'open' : ''}`}>
                                        {isContractAndAnnualLeaveInformation ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isContractAndAnnualLeaveInformation && (
                                    <div className="employment-container">
                                        <button className="employment-info-edit-btn">Edit</button>
                                        <div className="employment-info-grid">
                                            <div className="employment-info-item">
                                                <span className="employment-info-label">Entitlement unit in</span>
                                                <span className="employment-info-value">Days</span>
                                            </div>
                                            <div className="employment-info-item">
                                                <span className="employment-info-label">Annual leave balance</span>
                                                <span className="employment-info-value">28 days</span>
                                            </div>
                                            <div className="employment-info-item">
                                                <span className="employment-info-label">Place of work</span>
                                                <span className="employment-info-value">Working location <span className="employment-info-inline">not set</span></span>
                                            </div>
                                            <div className="employment-info-item">
                                                <span className="employment-info-label"></span>
                                                <span className="employment-info-value">Public holidays for <span className="employment-info-inline">England & Wales</span></span>
                                            </div>
                                            <div className="employment-info-item">
                                                <span className="employment-info-label">Mobile phone</span>
                                                <span className="employment-info-value">Not specified</span>
                                            </div>
                                        </div>
                                        <table className="employment-contract-summary">
                                            <thead>
                                                <tr>
                                                    <p className="employment-contract-summary-header">Contract summary</p>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="employment-info-label">Employment type</td>
                                                    <td className="employment-info-value">Fixed</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Entitlement unit</td>
                                                    <td className="employment-info-value">Days</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Contract start date</td>
                                                    <td className="employment-info-value">01 Jan 2024</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Working time pattern</td>
                                                    <td className="employment-info-value">Mon-Fri 9-5</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Contracted hours per week</td>
                                                    <td className="employment-info-value">35 hrs</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Annual leave year start</td>
                                                    <td className="employment-info-value">01 January</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Min. leave entitlement</td>
                                                    <td className="employment-info-value">28 days</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="contact-info-section">
                                {/*Employment summary */}
                                <div className="contact-header" onClick={toggleEmploymentSummary}>
                                    <span>Employment summary</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isEmploymentSummary ? 'open' : ''}`}>
                                        {isEmploymentSummary ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isEmploymentSummary && (
                                    <div className='employment-container'>
                                        <div className="employment-info-grid">
                                            <div className="employment-info-item">
                                                <span className="employment-info-label">Employee Start Date</span>
                                                <span className="employment-info-value">01 Jan 2024</span>
                                            </div>
                                            <div className="employment-info-item">
                                                <span className="employment-info-label">Length of Service</span>
                                                <span className="employment-info-value">1 year 9 months</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>



                        <div className="employment-container">
                            <div className="contact-info-section">
                                {/*Role Information */}
                                <div className="contact-header" onClick={toggleRoleInformation}>
                                    <span>Role Information</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isRoleInformation ? 'open' : ''}`}>
                                        {isRoleInformation ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isRoleInformation && (
                                    <div className='employment-container'>
                                        <table className="employment-contract-summary">
                                            <tbody>
                                                <tr>
                                                    <td className="employment-info-label">Job title</td>
                                                    <td className="employment-info-value">Director</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Contract type</td>
                                                    <td className="employment-info-value">Full - time</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Team(s)</td>
                                                    <td className="employment-info-value">xyz</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Probation required</td>
                                                    <td className="employment-info-value">No</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Notice period</td>
                                                    <td className="employment-info-value">*</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="contact-info-section">
                                {/*Salary Information */}
                                <div className="contact-header" onClick={toggleSalaryInformation}>
                                    <span>Salary Information</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isSalaryInformation ? 'open' : ''}`}>
                                        {isSalaryInformation ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isSalaryInformation && (
                                    <div className='employment-container'>
                                        <table className="employment-contract-summary">
                                            <tbody>
                                                <tr>
                                                    <td className="employment-info-label">Amount/rate</td>
                                                    <td className="employment-info-value">Not specified</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Hourly rate</td>
                                                    <td className="employment-info-value">Not specified</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Payment frequency</td>
                                                    <td className="employment-info-value">Not specified</td>
                                                </tr>
                                                <tr>
                                                    <td className="employment-info-label">Effective date</td>
                                                    <td className="employment-info-value">Not specified</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>


                            <div className="contact-info-section">
                                {/*Payroll information */}
                                <div className="contact-header" onClick={togglePayrollInformation}>
                                    <span>Payroll Information</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isPayrollInformation ? 'open' : ''}`}>
                                        {isPayrollInformation ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isPayrollInformation && (
                                    <div className='employment-container'>
                                        <div className="payroll-search-number">
                                            <span>Payroll Number</span>
                                            <input className='payroll-input-field' type="number" placeholder='search' />
                                        </div>
                                        <div className="payroll-heading">
                                            <strong className='payroll-pension'>Pension</strong>
                                        </div>
                                        <div className="pension-eligible">
                                            <span>Pension eligible?</span>
                                            <button className="pension-eligible-yes-btn">Yes</button>
                                            <button className="pension-eligible-no-btn">No</button>
                                        </div>
                                        <div className="pension-save-cancel-container">
                                            <button className="pension-save-btn">Save</button>
                                            <button className="pension-save-btn">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="contact-info-section">
                                {/* Bank Details */}
                                <div className="contact-header" onClick={toggleBankDetail}>
                                    <span>Bank Details</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isBankDetail ? 'open' : ''}`}>
                                        {isBankDetail ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isBankDetail && (
                                    <div className='employment-container'>
                                        <div className="all-placeholder">
                                            <div className="bank-search-number">
                                                <label htmlFor="account-name">Name of account</label>
                                                <input id="account-name" className='bank-input-field' type="text" placeholder='Enter account name' />
                                            </div>
                                            <div className="bank-search-number">
                                                <label htmlFor="bank-name">Name of bank</label>
                                                <input id="bank-name" className='bank-input-field' type="text" placeholder='Enter bank name' />
                                            </div>
                                            <div className="bank-search-number">
                                                <label htmlFor="bank-branch">Bank branch</label>
                                                <input id="bank-branch" className='bank-input-field' type="text" placeholder='Enter bank branch' />
                                            </div>
                                            <div className="bank-search-number">
                                                <label htmlFor="account-number">Account number</label>
                                                <input id="account-number" className='bank-input-field' type="text" placeholder='Enter account number' />
                                            </div>
                                            <div className="bank-search-number">
                                                <label htmlFor="sort-code">Sort code</label>
                                                <input id="sort-code" className='bank-input-field' type="text" placeholder='Enter sort code' />
                                            </div>
                                        </div>
                                        <div className="bank-detail-save">
                                            <button className='bank-detail-save-btn'>Save Bank Details</button>
                                            <button className='bank-detail-cancel-btn'>cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>



                            <div className="contact-info-section">
                                {/* Notes */}
                                <div className="contact-header" onClick={toggleNotes}>
                                    <span>Notes</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isNotes ? 'open' : ''}`}>
                                        {isNotes ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isNotes && (
                                    <div className="employment-container">
                                        <div className="note-area">
                                            <textarea className="note-textarea" placeholder="Enter your notes here..."></textarea>
                                        </div>
                                        <div className="note-action-buttons">
                                            <button className="note-save-btn">Save </button>
                                            <button className="note-cancel-btn">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="contact-info-section">
                                {/* Sensitive Details */}
                                <div className="contact-header" onClick={toggleSensitiveDetail}>
                                    <span>Sensitive Details</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isSensitiveDetail ? 'open' : ''}`}>
                                        {isSensitiveDetail ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isSensitiveDetail && (
                                    (
                                        <Box sx={{ padding: '1.2rem' }} className='employment-container'>
                                            <Grid container spacing={1} sx={{ marginTop: '12px' }} className="all-placeholder">

                                                {/* Tax and National Insurance Section */}
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <Typography variant="h6" sx={{ marginTop: '-30px' }}>Tax</Typography>
                                                    <TextField
                                                        id="tax-code"
                                                        label="Tax"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Enter Tax code"
                                                        sx={{ marginLeft: '-22px' }}
                                                    />
                                                </Grid>
                                                <Typography variant="h6" sx={{ marginLeft: '12px' }}>National Insurance</Typography>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="national-insurance"
                                                        label="National Insurance"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Enter national insurance"
                                                        sx={{ marginLeft: '10px', marginTop: '-17px' }}
                                                    />
                                                </Grid>

                                                {/* Passport Section */}
                                                <Typography variant="h6" sx={{ marginLeft: '12px' }}>Passport</Typography>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="passport-number"
                                                        label="Passport"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Enter passport number"
                                                        sx={{ marginLeft: '10px', marginTop: '-17px' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="country-issue"
                                                        label="Country of Issue"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Passport country"
                                                        sx={{ marginLeft: '12px' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="issue-date"
                                                        label="Date of expiry"
                                                        type="date"
                                                        variant="outlined"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{ marginLeft: '12px' }}
                                                    />
                                                </Grid>

                                                {/* Driving Licence and Sort Code Section */}
                                                <Typography variant="h6" sx={{ marginLeft: '12px' }}>Driving Licence</Typography>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="driving-licence"
                                                        label="Driving Licence"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Enter driving licence number"
                                                        sx={{ marginLeft: '10px', marginTop: '-17px' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="#"
                                                        label="Country of issue"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Country of issue"
                                                        sx={{ marginLeft: '12px' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="#"
                                                        label="Licence class"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Licence class"
                                                        sx={{ marginLeft: '12px' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="issue-date"
                                                        label="Date of expiry"
                                                        type="date"
                                                        variant="outlined"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{ marginLeft: '12px' }}
                                                    />
                                                </Grid>


                                                <Typography variant="h6" sx={{ marginLeft: '12px' }}>Visa</Typography>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="driving-licence"
                                                        label="Visa number"
                                                        variant="outlined"
                                                        fullWidth
                                                        sx={{ marginLeft: '10px', marginTop: '-17px' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={8} sm={12} className="bank-search-number">
                                                    <TextField
                                                        id="issue-date"
                                                        label="Visa Expiry Date"
                                                        type="date"
                                                        variant="outlined"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{ marginLeft: '12px' }}
                                                    />
                                                </Grid>

                                            </Grid>

                                            <Box sx={{ padding: '1rem' }}>
                                                <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                                                    DBS Check
                                                </Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checkedA}
                                                            onChange={handleChangeA}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="DBS initial check conducted"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checkedB}
                                                            onChange={handleChangeB}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="DBS check conducted"
                                                />

                                                {/* Show Date Field if either checkbox is selected */}
                                                {(checkedA || checkedB) && (
                                                    <Box sx={{ marginTop: '1rem' }}>
                                                        <TextField
                                                            id="dbs-check-date"
                                                            label="Date of DBS Check"
                                                            type="date"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={date}
                                                            onChange={handleDateChange}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>

                                            <Typography variant="h6" sx={{ marginLeft: '12px' }}>
                                                Right to Work
                                            </Typography>
                                            <Grid item xs={8} sm={12} className="bank-search-number">
                                                <FormControl fullWidth variant="outlined" sx={{ marginLeft: '10px' }}>
                                                    <Select
                                                        id="right-to-work-select"

                                                        onChange={handleChange}
                                                        displayEmpty

                                                    >
                                                        <MenuItem value="" disabled>
                                                            Select Right to Work
                                                        </MenuItem>
                                                        <MenuItem value="yes">Settled</MenuItem>
                                                        <MenuItem value="no">Pre-settled</MenuItem>
                                                        <MenuItem value="pending">Not declared</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Action Buttons */}
                                            <Box sx={{ marginTop: '1rem' }} className="bank-detail-save">
                                                <button variant="contained" color="primary" className="bank-detail-save-btn" sx={{ marginRight: '1rem' }}>
                                                    Save
                                                </button>
                                                <button variant="outlined" color="secondary" className="bank-detail-cancel-btn">
                                                    Cancel
                                                </button>
                                            </Box>
                                        </Box>
                                    )
                                )}
                            </div>



                            <div className="contact-info-section">
                                {/* Termination */}
                                <div className="contact-header" onClick={toggleTermination}>
                                    <span>Termination</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isTermination ? 'open' : ''}`}>
                                        {isTermination ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isTermination && (
                                    <Box sx={{ marginTop: '1rem' }}>
                                        {/* Date Field */}
                                        <TextField
                                            id="termination-date"
                                            label="Termination Date"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            value={date}
                                            onChange={handleDateChange}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ marginBottom: '1rem' }}
                                        />

                                        {/* Dropdown */}
                                        <FormControl fullWidth variant="outlined" sx={{ marginBottom: '1rem' }}>
                                            <Select
                                                id="termination-reason"
                                                value={selectedOption}
                                                onChange={handleDropdownChange}
                                                displayEmpty
                                                renderValue={(selected) => (selected ? selected : 'Select Reason')}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Reason
                                                </MenuItem>
                                                <MenuItem value="voluntary">Voluntary</MenuItem>
                                                <MenuItem value="involuntary">Involuntary</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Textarea */}
                                        <TextareaAutosize
                                            minRows={3}
                                            placeholder="Additional Notes"
                                            value={notes}
                                            onChange={handleNotesChange}
                                            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />

                                        {/* Toggle Buttons */}
                                        <Box sx={{ padding: '5px' }}>
                                            <Box sx={{ padding: '10px' }}>
                                                <Typography>Exit interview performed?</Typography>
                                                <input type="checkbox" className='on-check-button' />
                                            </Box>
                                            <Box sx={{ padding: '10px' }}>
                                                <Typography>Suitable for re-engagement?</Typography>
                                                <input type="checkbox" className='on-check-button' />
                                            </Box>
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box sx={{ marginTop: '1rem' }} className="bank-detail-save">
                                            <button variant="contained" color="primary" className="bank-detail-save-btn" sx={{ marginRight: '1rem' }}>
                                                Save
                                            </button>
                                            <button variant="outlined" color="secondary" className="bank-detail-cancel-btn">
                                                Cancel
                                            </button>
                                        </Box>

                                    </Box>
                                )}
                            </div>


                            <div className="contact-info-section">
                                {/* Delete employee record */}
                                <div className="contact-header" onClick={toggleDeleteEmployeeRecord}>
                                    <span>Delete employee record</span>
                                    {/* <p>Contracted hours of work, employment start date and leave entitlement</p> */}
                                    <span className={`dropdown-icon ${isDeleteEmployeeRecord ? 'open' : ''}`}>
                                        {isDeleteEmployeeRecord ? '▲' : '▼'}
                                    </span>
                                </div>
                                {isDeleteEmployeeRecord && (
                                    <Box sx={{ marginTop: '1rem' }} className="bank-detail-save">
                                        <button variant="contained" color="primary" className="bank-detail-save-btn" sx={{ marginRight: '1rem' }}>
                                            Delete Record
                                        </button>
                                        <button variant="outlined" color="secondary" className="bank-detail-cancel-btn">
                                            Download Record
                                        </button>
                                    </Box>

                                )}
                            </div>

                        </div>
                    </div>
                )}

                {activeBtn === 'overtime' && (
                    <div className="overtime-container">
                        <header className="overtime-header">
                            <h1>Overtime</h1>
                            <button className="log-overtime-btn">Log overtime</button>
                        </header>

                        <div className="overtime-sections">
                            <OvertimeSection
                                title="Time off in lieu (TOIL)"
                                items={[
                                    { label: 'TOIL logged', time: '0h 0m', description: 'No approved claims' },
                                    { label: 'TOIL taken', time: '0h 0m', description: 'No TOIL absences' },
                                    { label: 'TOIL balance', time: '0h 0m', description: 'Available to take' }
                                ]}
                                btnText="Use TOIL"
                            />

                            <OvertimeSection
                                title="Payable"
                                items={[
                                    { label: 'Overtime logged', time: '0h 0m', description: 'No approved claims' },
                                    { label: 'Paid', time: '0h 0m', description: 'Payment scheduled or paid' },
                                    { label: 'Pending payment', time: '0h 0m', description: 'Approved awaiting payment' }
                                ]}
                            />
                        </div>

                        <div className="accordion-section">
                            {['Current and future (0)', 'History (0)', 'Cancelled (0)'].map((title, index) => (
                                <AccordionItem
                                    key={index}
                                    title={title}
                                    isOpen={accordionOpen[title.toLowerCase().replace(/\s/g, '')]}
                                    onClick={() => toggleAccordion(title.toLowerCase().replace(/\s/g, ''))}
                                />
                            ))}
                        </div>
                    </div>
                )}



                {activeBtn === 'personal' && (
                    <div className="info-section">
                        {/* Contact Information Dropdown */}
                        <div className="contact-info-section">
                            <div className="contact-header" onClick={toggleDropdown}>
                                <span>Contact Information</span>
                                <span className={`dropdown-icon ${isOpen ? 'open' : ''}`}>
                                    {isOpen ? '▲' : '▼'}
                                </span>
                            </div>
                            {isOpen && (
                                <div>
                                    <button className='info-edit-btn'>Edit</button>
                                    <div className="contact-details">
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">Account email</span>
                                                <span className="info-value">ndanda@arjglobal.co.uk</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Personal email</span>
                                                <span className="info-value">Not specified</span>
                                            </div>
                                        </div>
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">Home phone</span>
                                                <span className="info-value">Not specified</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Mobile phone</span>
                                                <span className="info-value">Not specified</span>
                                            </div>
                                        </div>
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">Work phone</span>
                                                <span className="info-value">07446957575</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Work extension</span>
                                                <span className="info-value">Not specified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Personal Information Dropdown */}
                        <div className="contact-info-section">
                            <div className="contact-header" onClick={togglePersonalInfo}>
                                <span>Personal Information</span>
                                <span className={`dropdown-icon ${isPersonalOpen ? 'open' : ''}`}>
                                    {isPersonalOpen ? '▲' : '▼'}
                                </span>
                            </div>
                            {isPersonalOpen && (
                                <div>
                                    <button className='info-edit-btn'>Edit</button>
                                    <div className="contact-details">
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">Title</span>
                                                <span className="info-value">Mr.</span>
                                            </div>
                                            <div>
                                                <span className="info-label">First Name</span>
                                                <span className="info-value">John</span>
                                            </div>
                                        </div>
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">Last Name</span>
                                                <span className="info-value">Doe</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Middle Name</span>
                                                <span className="info-value">Not specified</span>
                                            </div>
                                        </div>
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">DOB</span>
                                                <span className="info-value">01/01/1990</span>
                                            </div>
                                            <div>
                                                <span className="info-label">Gender</span>
                                                <span className="info-value">Male</span>
                                            </div>
                                        </div>
                                        <div className="info-group">
                                            <div>
                                                <span className="info-label">Address</span>
                                                <span className="info-value">123 Street, City, Country</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Medical Information Dropdown */}
                        <div className="contact-info-section">
                            <div className="contact-header" onClick={toggleMedicalInfo}>
                                <span>Medical Information</span>
                                <span className={`dropdown-icon ${isMedicalOpen ? 'open' : ''}`}>
                                    {isMedicalOpen ? '▲' : '▼'}
                                </span>
                            </div>
                            {isMedicalOpen && (
                                <div>
                                    <button className='info-edit-btn'>Edit</button>
                                    <div className="contact-details">
                                        <textarea
                                            className="medical-textarea"
                                            placeholder="Enter medical information (up to 10,000 words)"
                                            maxLength={10000}
                                            rows="10"
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {activeBtn === 'emergencies' && (
                    <div className='emergency-container'>
                        <div className="emergency-alert-message">
                            <span className='emergency-span'>Add at least one emergency contact in case something unexpected happens.</span>
                        </div>
                        <div style={{ marginTop: '12px', marginLeft: '30px' }}>
                            <button className="emergency-button">Add new emergency contact</button>
                        </div>
                    </div>
                )}

                {activeBtn === 'documents' && (
                    <div className="my-documents">
                        <div className="header">
                            <div className="breadcrumb">
                                <span>All folders</span>
                                <span className="separator">:-</span>
                                <span>My documents</span>
                            </div>
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search My documents..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="document-search-button">Search</button>
                            </div>
                        </div>

                        <div className="actions">
                            <button className="download-button">Download</button>
                            <div className="right-actions">
                                <button className="upload-button">Upload</button>
                                <button className="new-folder-button">New folder</button>
                                <button className="create-report-button">Create report</button>
                            </div>
                        </div>

                        <div className="content">
                            {searchQuery === '' && (
                                <Box
                                    className="empty-folder"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="100%"
                                    textAlign="center"
                                >
                                    <img src={EmptyFolderIcon} alt="Empty Folder" style={{ width: '100px', height: '100px', marginBottom: '16px' }} />
                                    <Typography variant="h6">This folder is empty</Typography>
                                </Box>
                            )}
                        </div>

                        <div className="footer">
                            <div className="view-options">
                                <span>View</span>
                                <select>
                                    {options.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <span>per page</span>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default PersonalInfo;

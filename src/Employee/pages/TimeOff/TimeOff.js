// import React, { useState, useMemo, useCallback } from "react";
// import {
//   format,
//   startOfYear,
//   addMonths,
//   endOfMonth,
//   eachDayOfInterval,
//   isToday,
//   startOfMonth,
//   getDay,
//   isFuture,
//   isBefore,
//   isWithinInterval,
// } from "date-fns";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import Header from "../../../Employee/components/Navbar/Navbar";
// import Popup from "./Popup";
// import "./TimeOff.css";
// import IconMapper from "../../../components/IconMapper/IconMapper";
// import DynamicButton from "../../../components/DynamicButton/DynamicButton";
// const profileImage = "/assets/images/profile.jpg";

// // Generate days of a given month
// const generateMonthDays = (monthStart) => {
//   const monthEnd = endOfMonth(monthStart);
//   return eachDayOfInterval({ start: monthStart, end: monthEnd });
// };

// const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// // TimeOff Component
// const TimeOff = () => {
//   const [selectedYear, setSelectedYear] = useState(() =>
//     new Date().getFullYear()
//   );
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const leavePeriods = useMemo(
//     () => [
//       { start: new Date(2024, 8, 20), end: new Date(2024, 8, 25) }, 
//     ],
//     []
//   );

//   const startOfYearDate = useMemo(
//     () => startOfYear(new Date(selectedYear, 0, 1)),
//     [selectedYear]
//   );
//   const months = useMemo(
//     () =>
//       Array.from({ length: 12 }, (_, index) =>
//         addMonths(startOfYearDate, index)
//       ),
//     [startOfYearDate]
//   );
//   const today = useMemo(() => new Date(), []);

//   // Handle year change
//   const handleYearChange = useCallback((event) => {
//     setSelectedYear(Number(event.target.value));
//   }, []);

//   // Toggle popup visibility
//   const togglePopup = useCallback(() => {
//     console.log("Popup toggled"); 
//     setIsPopupOpen((prev) => !prev);
//   }, []);

//   const isOnLeave = (day) => {
//     return leavePeriods.some((period) =>
//       isWithinInterval(day, { start: period.start, end: period.end })
//     );
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const handleFormSubmit = (data) => {
//     console.log("Form Submitted", data);
//     setIsPopupOpen(false);
//   };

//   return (
//     <>
//       <Header
//         siteName={"Book Off-Time"}
//         userName={"Jaideep"}
//         profileImage={profileImage}
//         showLinks={["timeoff"]}
//       />
//       <div className="timeoff-container">
//         <div className="timeoff-calendar-container">
//           <div className="timeoff-year-selector">
//             <FormControl variant="outlined" className="select-year">
//               <InputLabel id="year-label">Select Year</InputLabel>
//               <Select
//                 labelId="year-label"
//                 id="year"
//                 value={selectedYear}
//                 onChange={handleYearChange}
//                 label="Select Year"
//               >
//                 {Array.from(
//                   { length: 18 },
//                   (_, index) => new Date().getFullYear() - 1 + index
//                 ).map((year) => (
//                   <MenuItem key={year} value={year}>
//                     {year}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>
//           <div className="maindiv">
//             <div className="timeoff-month-grid">
//               {months.map((monthStart, index) => {
//                 const monthName = format(monthStart, "MMMM");
//                 const monthDays = generateMonthDays(monthStart);
//                 const firstDayOfMonth = getDay(startOfMonth(monthStart));

//                 const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

//                 return (
//                   <div key={index} className="timeoff-month-container">
//                     <h2>{monthName}</h2>
//                     <div className="timeoff-days-grid">
//                       {daysOfWeek.map((day, dayIndex) => (
//                         <div
//                           key={dayIndex}
//                           className={`timeoff-day-name
//                         ${day === "Sat" ? "Sat" : ""}
//                         ${day === "Sun" ? "Sun" : ""}
//                       `}
//                         >
//                           {day}
//                         </div>
//                       ))}

//                       {Array.from({ length: offset }).map((_, emptyIndex) => (
//                         <div
//                           key={emptyIndex}
//                           className="timeoff-day empty"
//                         ></div>
//                       ))}

//                       {monthDays.map((day, dayIndex) => (
//                         <div
//                           key={dayIndex}
//                           className={`timeoff-day
//                           ${isToday(day) ? "today" : ""}
//                           ${isFuture(day) ? "future" : ""}
//                           ${getDay(day) === 0 ? "sunday" : "sundays"}
//                           ${getDay(day) === 6 ? "saturday" : ""}
//                           ${isBefore(day, today) && !isToday(day) ? "past" : ""}
//                           ${isOnLeave(day) ? "leave" : ""}
//                         `}
//                           onClick={togglePopup} // Added click event here
//                         >
//                           <span className="timeoff-day-number">
//                             {format(day, "d")}
//                           </span>
//                           {isOnLeave(day) && (
//                             <span className="timeoff-umbrella-icon">🏖️</span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="button-container">
//               <DynamicButton
//                 text="Book Time"
//                 onClick={togglePopup}
//                 height="60px"
//                 width="240px"

//                 backgroundColor="#28a745"
//                 icon={() => (
//                   <IconMapper
//                     iconName={"AddIcon"}
//                     className="timeoffAddbutton"
//                   />
//                 )}
//               />
//               <DynamicButton
//                 text="Leave Taken"
//                 height="60px"
//                 width="240px"
//                 backgroundColor="#28a745"
                
//               />

//             </div>
//           </div>
//         </div>
//       </div>
//       <Popup
//         open={isPopupOpen}
//         onClose={handleClosePopup}
//         onSubmit={handleFormSubmit}
//       />
//     </>
//   );
// };

// export default TimeOff;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  format,
  startOfYear,
  addMonths,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  startOfMonth,
  getDay,
  isFuture,
  isBefore,
  isWithinInterval
} from "date-fns";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Header from "../../../Employee/components/Navbar/Navbar";
import Popup from "./Popup"; 
import "./TimeOff.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";
import { fetchApprovedLeaveRequests, submitLeaveRequest } from "../../EmpApiServices";

const profileImage = "/assets/images/profile.jpg";

// Generate days of a given month
const generateMonthDays = (monthStart) => {
  const monthEnd = endOfMonth(monthStart);
  return eachDayOfInterval({ start: monthStart, end: monthEnd });
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimeOff = () => {
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [leaveData, setLeaveData] = useState({ startDate: '', endDate: '', type: '', partialDays: '' });
  const [leavePeriods, setLeavePeriods] = useState([]); // Holds approved leave periods

  const startOfYearDate = useMemo(() => startOfYear(new Date(selectedYear, 0, 1)), [selectedYear]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => addMonths(startOfYearDate, index)), [startOfYearDate]);
  const today = useMemo(() => new Date(), []);

  // Fetch approved leave requests from API or local storage
  const fetchLeavePeriods = async () => {
    try {
      const response = await fetchApprovedLeaveRequests();
      const approvedLeaves = response.data; 

      localStorage.setItem('approvedLeaves', JSON.stringify(approvedLeaves));
      setLeavePeriods(approvedLeaves);
    } catch (error) {
      console.error("Error fetching approved leave requests:", error);
    }
  };

  const loadLeavePeriodsFromLocalStorage = () => {
    const savedLeaves = localStorage.getItem('approvedLeaves');
    if (savedLeaves) {
      setLeavePeriods(JSON.parse(savedLeaves));
    }
  };

  useEffect(() => {
    fetchLeavePeriods();
    loadLeavePeriodsFromLocalStorage(); 
  }, []);

  const handleYearChange = useCallback((event) => {
    setSelectedYear(Number(event.target.value));
  }, []);

  const togglePopup = useCallback(() => {
    setIsPopupOpen((prev) => !prev);
  }, []);

  const isOnLeave = (day) => {
    return leavePeriods.some((period) => {
      const start = new Date(period.start); 
      const end = new Date(period.end);     
      return isWithinInterval(day, { start, end });
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLeaveData({ startDate: '', endDate: '', type: '', partialDays: '' }); 
  };

  const handleSubmitLeaveRequest = async () => {
    try {
      await submitLeaveRequest(leaveData);

      const newLeavePeriod = {
        start: leaveData.startDate,
        end: leaveData.endDate,
        type: leaveData.type,
        partialDays: leaveData.partialDays,
      };
      console.log(updatedLeavePeriods)
      const updatedLeavePeriods = [...leavePeriods, newLeavePeriod];
      setLeavePeriods(updatedLeavePeriods);
      localStorage.setItem('approvedLeaves', JSON.stringify(updatedLeavePeriods));

      handleClosePopup();
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  return (
    <>
      <Header
        siteName={"Book Off-Time"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["timeoff"]}
      />
      <div className="timeoff-container">
        <div className="timeoff-calendar-container">
          <div className="timeoff-year-selector">
            <FormControl variant="outlined" className="select-year">
              <InputLabel id="year-label">Select Year</InputLabel>
              <Select
                labelId="year-label"
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
                label="Select Year"
              >
                {Array.from({ length: 18 }, (_, index) => new Date().getFullYear() - 1 + index).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="maindiv">
            <div className="timeoff-month-grid">
              {months.map((monthStart, index) => {
                const monthName = format(monthStart, "MMMM");
                const monthDays = generateMonthDays(monthStart);
                const firstDayOfMonth = getDay(startOfMonth(monthStart));
                const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

                return (
                  <div key={index} className="timeoff-month-container">
                    <h2>{monthName}</h2>
                    <div className="timeoff-days-grid">
                      {daysOfWeek.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`timeoff-day-name
                          ${day === "Sat" ? "Sat" : ""}
                          ${day === "Sun" ? "Sun" : ""}
                        `}
                        >
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: offset }).map((_, emptyIndex) => (
                        <div key={emptyIndex} className="timeoff-day empty"></div>
                      ))}
                      {monthDays.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`timeoff-day
                          ${isToday(day) ? "today" : ""}
                          ${isFuture(day) ? "future" : ""}
                          ${getDay(day) === 0 ? "sunday" : "sundays"}
                          ${getDay(day) === 6 ? "saturday" : ""}
                          ${isBefore(day, today) && !isToday(day) ? "past" : ""}
                          ${isOnLeave(day) ? "leave" : ""}
                        `}
                        onClick={() => {
                          if (isToday(day) || isFuture(day)) {
                            setLeaveData({
                              startDate: format(day, 'yyyy-MM-dd'), 
                              endDate: format(day, 'yyyy-MM-dd'),
                              type: '',
                              partialDays: ''
                            });
                            togglePopup();
                          }
                        }}
                        >
                          <span className="timeoff-day-number">
                            {format(day, "d")}
                          </span>
                          {isOnLeave(day) && (
                            <span className="timeoff-umbrella-icon">🏖️</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="button-container">
              <DynamicButton
                text="Book Time"
                onClick={togglePopup}
                height="60px"
                width="240px"
                backgroundColor="#28a745"
                icon={() => (
                  <button
                    title="Add New"
                    className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="45px"
                      height="45px"
                      viewBox="0 0 24 24"
                
                      className="stroke-orange-500 fill-none group-active:stroke-white group-active:fill-orange-500 group-active:duration-0 duration-300"
                    >
                      <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        strokeWidth="1.5"
                      ></path>
                      <path d="M8 12H16" strokeWidth="1.5"></path>
                      <path d="M12 16V8" strokeWidth="1.5"></path>
                    </svg>
                  </button>
                )}
              />
              <DynamicButton
                text="Leave Taken"
                height="60px"
                width="240px"
                backgroundColor="#28a745"
              />
            </div>
          </div>
        </div>
      </div>
      <Popup
        open={isPopupOpen}
        onClose={handleClosePopup}
        leaveData={leaveData}
        setLeaveData={setLeaveData}
        onSubmit={handleSubmitLeaveRequest}
      />
    </>
  );
};

export default TimeOff;

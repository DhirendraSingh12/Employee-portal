import React, { useMemo, useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import "./Timesheets.css";
import {
  generateDates,
  getWeeksOfMonth,
  convertTo24HourFormat,
  calculateHours,
} from "../../../Utils/helper";
import { submitTimesheets } from "../../EmpApiServices";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { isFuture } from "date-fns";
import { getTimesheetById } from "../../../SuperAdmin/ApiServices";
const Timesheets = ({ updateTotalHours }) => {
  const { employeeName, employeeId } = useSelector((state) => state.auth.user);
  const jwtToken = useSelector((state) => state.auth.token);
  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [week, setWeek] = useState(1);
  const [rows, setRows] = useState(() => generateDates(year, month, week));
  const [weekRanges, setWeekRanges] = useState(() =>
    getWeeksOfMonth(year, month)
  );
  const [submitted, setSubmitted] = useState(false);
  const currentDate = new Date(); // Get the current date
  const currentDateString = currentDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD (adjust according to your date format)

  const fetchTimesheets = async (employeeId) => {
    try {
      const data = await getTimesheetById(employeeId);

      // Filter rows based on matching inDate from data
      const updatedRows = rows.map((row) => {
        // Find matching entry in data based on inDate
        const matchingData = data.find((item) => item.inDate === row.inDate);

        // If a match is found, update the row with data from API
        return matchingData ? { ...row, ...matchingData } : row;
      });

      setRows(updatedRows);
      console.log({ rows });
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
    }
  };
  useEffect(() => {
    fetchTimesheets(employeeId);
  }, []);

  useEffect(() => {
    const weeks = getWeeksOfMonth(year, month);
    setWeekRanges(weeks);
    const currentWeek =
      weeks.findIndex((range) => {
        const [start, end] = range.split(" : ");
        const currentDate = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return currentDate >= start && currentDate <= end;
      }) + 1;
    setWeek(currentWeek || 1);
    setRows(generateDates(year, month, currentWeek || 1));
  }, [year, month, now]);

  useEffect(() => {
    if (submitted) {
      const totalHours = rows.reduce(
        (sum, row) => sum + parseFloat(row.hours || 0),
        0
      );
      updateTotalHours(totalHours);
    }
  }, [rows, submitted, updateTotalHours]);

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value, 10);
    setMonth(selectedMonth);
    setRows(generateDates(year, selectedMonth, week));
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setYear(selectedYear);
    setRows(generateDates(selectedYear, month, week));
  };

  const handleWeekChange = (e) => {
    const selectedWeek = parseInt(e.target.value, 10);
    setWeek(selectedWeek);
    setRows(generateDates(year, month, selectedWeek));
  };

  const incrementDateByOneDay = (dateStr) => {
    const date = new Date(dateStr.split("-").reverse().join("-"));
    date.setDate(date.getDate() + 1);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    const row = newRows[index];
    row[field] = value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateParts = row.inDate.split("-");
    const rowDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

    if (rowDate.getTime() === today.getTime()) {
      const dayOfWeek = rowDate.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (
          !row.inTimeHH ||
          !row.inTimeMM ||
          !row.outTimeHH ||
          !row.outTimeMM
        ) {
          row.attendanceStatus = "Weekend";
          row.status = "Not required";
          row.hours = "0";
        }
      } else {
        if (row.inTimeHH && row.inTimeMM && row.outTimeHH && row.outTimeMM) {
          const inTime = convertTo24HourFormat(
            row.inTimeHH,
            row.inTimeMM,
            row.inPeriod
          );
          const outTime = convertTo24HourFormat(
            row.outTimeHH,
            row.outTimeMM,
            row.outPeriod
          );

          row.hours = calculateHours(inTime, outTime).toFixed(2);
          row.attendanceStatus = "Regularized";
          row.status = "PENDING";
        } else {
          row.attendanceStatus = "Pending";
          row.status = "Incomplete";
          row.hours = "";
        }
      }
    }

    setRows(newRows);
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const newRows = rows.map((row) => {
      const {
        inDate,
        inTimeHH,
        inTimeMM,
        inPeriod,
        outTimeHH,
        outTimeMM,
        outPeriod,
      } = row;
      const dateParts = inDate.split("-");
      const rowDate = new Date(
        `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (rowDate.getTime() === today.getTime()) {
        let attendanceStatus = "Pending";
        let status = "Incomplete";
        let hours = "";
        if (
          inTimeHH &&
          inTimeMM &&
          inPeriod &&
          outTimeHH &&
          outTimeMM &&
          outPeriod
        ) {
          const inTime = convertTo24HourFormat(inTimeHH, inTimeMM, inPeriod);
          const outTime = convertTo24HourFormat(
            outTimeHH,
            outTimeMM,
            outPeriod
          );
          hours = calculateHours(inTime, outTime).toFixed(2);
          attendanceStatus = "Regularized";
          status = "PENDING";
        }
        console.log(attendanceStatus, hours, status);
        return { ...row, attendanceStatus, status, hours };
      }
      return row;
    });
    const filteredRows = newRows.filter(
      (row) =>
        row.inTimeHH &&
        row.inTimeMM &&
        row.inPeriod &&
        row.outTimeHH &&
        row.outTimeMM &&
        row.outPeriod
    );
    const payload = filteredRows.map(
      ({
        inDate,
        inTimeHH,
        inTimeMM,
        inPeriod,
        outDate,
        outTimeHH,
        outTimeMM,
        outPeriod,
        hours,
        attendanceStatus,
        status,
      }) => ({
        employeeId,
        employeeName,
        inDate,
        inTimeHH: parseInt(inTimeHH, 10),
        inTimeMM: parseInt(inTimeMM, 10),
        inPeriod,
        outDate,
        outTimeHH: parseInt(outTimeHH, 10),
        outTimeMM: parseInt(outTimeMM, 10),
        outPeriod,
        hours,
        attendanceStatus,
        status,
      })
    );
    if (payload.length > 0) {
      try {
        const response = await submitTimesheets(payload[0], jwtToken);
        console.log("Timesheet submitted successfully:", response);
        toast.success("Timesheet submitted successfully");
      } catch (error) {
        console.error(
          "Error submitting timesheet:",
          error.response?.data || error.message
        );
      }
    } else {
      toast.success("No valid rows to submit.");
    }
  };

  return (
    <div className="TimeSheet-table-container">
      <div className="timesheet-header">
        <h2>Timesheet</h2>
      </div>
      <div className="dropdowns">
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={handleYearChange} label="Year">
            {[2022, 2023, 2024, 2025].map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={handleMonthChange} label="Month">
            {Array.from({ length: 12 }).map((_, i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Week</InputLabel>
          <Select value={week} onChange={handleWeekChange} label="Week">
            {weekRanges.map((range, i) => (
              <MenuItem key={i} value={i + 1}>
                Week {i + 1} ({range})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="TimeSheet-tablebody">
        <table className="TimeSheet-table-data">
          <thead>
            <tr>
              <th className="timesheetth">In Date</th>
              <th className="timesheetth">In Time (HH)</th>
              <th className="timesheetth">In Time (MM)</th>
              <th className="timesheetth">AM/PM</th>
              <th className="timesheetth">Out Date</th>
              <th className="timesheetth">Out Time (HH)</th>
              <th className="timesheetth">Out Time (MM)</th>
              <th className="timesheetth">AM/PM</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Hours </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              // Check if the row date is in the future
              const isFutureDate = new Date(row.inDate) > currentDate;

              return (
                <tr key={index}>
                  <td>{row.inDate}</td>
                  <td>
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      disabled={isFutureDate} // Disable if the date is in the future
                    >
                      <InputLabel>HH</InputLabel>
                      <Select
                        value={row.inTimeHH || ""}
                        onChange={(e) =>
                          handleInputChange(index, "inTimeHH", e.target.value)
                        }
                        label="HH"
                        size="small"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <MenuItem
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td>
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      disabled={isFutureDate} // Disable if the date is in the future
                    >
                      <InputLabel>MM</InputLabel>
                      <Select
                        value={
                          row.inTimeMM
                        }
                        onChange={(e) =>
                          handleInputChange(index, "inTimeMM", e.target.value)
                        }
                        label="MM"
                        size="small"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map(
                          (minute) => (
                            <MenuItem
                              key={minute}
                              value={minute }
                            >
                              {minute }
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td>
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      disabled={isFutureDate} // Disable if the date is in the future
                    >
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        sx={{ height: "40px", width: "170px" }}
                        value={row.inPeriod || ""}
                        onChange={(e) =>
                          handleInputChange(index, "inPeriod", e.target.value)
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </td>

                  <td>{row.outDate}</td>
                  <td>
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      disabled={isFutureDate} // Disable if the date is in the future
                    >
                      <InputLabel>HH</InputLabel>
                      <Select
                        value={row.outTimeHH || ""}
                        onChange={(e) =>
                          handleInputChange(index, "outTimeHH", e.target.value)
                        }
                        label="HH"
                        size="small"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <MenuItem key={hour} value={hour}>
                              {hour}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td>
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      disabled={isFutureDate} // Disable if the date is in the future
                    >
                      <InputLabel>MM</InputLabel>
                      <Select
                        value={
                          row.outTimeMM 
                        }
                        onChange={(e) =>
                          handleInputChange(index, "outTimeMM", e.target.value)
                        }
                        label="MM"
                        size="small"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map(
                          (minute) => (
                            <MenuItem
                              key={minute}
                              value={minute}
                            >
                              {minute }
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td>
                    <FormControl
                      variant="outlined"
                      size="small"
                      fullWidth
                      className="TimeSheet-custom-form-control"
                      disabled={isFutureDate} // Disable if the date is in the future
                    >
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        sx={{ height: "40px", width: "170px" }}
                        value={row.outPeriod || ""}
                        onChange={(e) =>
                          handleInputChange(index, "outPeriod", e.target.value)
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </td>

                  <td>{row.attendanceStatus || ""}</td>
                  <td>{row.status || ""}</td>
                  <td>{row.hours || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="timesheetsubmit">
        <DynamicButton
          text="Submit"
          onClick={handleSubmit}
          height="50px"
          backgroundColor="#6674a9"
          color={"white"}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Timesheets;

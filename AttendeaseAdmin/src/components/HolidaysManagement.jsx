/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/calendar.css";
import "./css/HolidayManagement.css";
import * as XLSX from "xlsx";
import { useEffect } from "react";
import axios from "axios";
function HolidaysManagement() {
  const [date, setDate] = useState(new Date()); // Selected Date stored
  const [holidays, setHolidays] = useState({}); // All Object stored in array
  const [holidayList, setHolidayList] = useState([]); //

  // const holidays = {
  //     "2026-04-02": "Ram Navmi",
  //     "2026-04-10": "Good Friday",
  //     "2026-04-14": "Ambedkar Jayanti"
  // };

  // Why use this fuction- Actually React Calendar gives date like:-Sun May 11 2026 00:00:00 GMT... But your holidays object stores:- 2026-05-11 so we convert both into same format.
  const formatdate = (date) => {
    if (!date) return null;

    return new Date(date).toISOString().split("T")[0];
  };

  // Convert into Friendly format which is "YYYY-MM-DD"
  //This fuction & logic how's works
  // 1----> Why Subtracted 25569------ because excel start counting from 1 Jan 1900 but javascript date starts counting from 1 Jan 1970 so there are 25569 days. between 1900 and 1970. so we subtract it to align with javascript system.
  const excelDateToJSDate = (excelDate) => {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    //2------> why used 86400----- because 86400 seconds = 1 day
    //3------->  Why used ----- becuase JavaScirpt Date Works in milliseconds. not seconds.  so JS automatiicaly count this new Date(177746089256). ex=17746089256
    return date.toISOString().split("T")[0];
  };

  // Fetch Holidays From DB
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/fetch-holidays`);

<<<<<<< HEAD
        const response = await axios.get(
            `http://localhost:7000/fetch-holidays`
        );
=======
      const holidayObj = {};
>>>>>>> 58845a09b0e925d5e9509241a91c77981d465ae8

      const holidayArr = [];

      response.data.result.forEach((item) => {
        const formattedDate = new Date(item.holiday_date)
          .toISOString()
          .split("T")[0];
        holidayObj[formattedDate] = item.holiday_name;

        holidayArr.push({
          date: formattedDate,
          name: item.holiday_name,
        });
      });

<<<<<<< HEAD
        // Save Holiday Into Database
        await axios.post(
            `http://localhost:7000/addHolidays`,
            {
                holidayDate: formattedDate,
                holidayName: name
            }
        );
=======
      setHolidays(holidayObj);

      setHolidayList(holidayArr);
    } catch (err) {
      console.log(err);
>>>>>>> 58845a09b0e925d5e9509241a91c77981d465ae8
    }
  };

  // Component Load
  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log(jsonData); // Debugging Check

      const holidayObj = {};
      const holidayArr = [];

      // one by one insert data in db thats why used for of of
      for (const item of jsonData) {
        const formattedDate = excelDateToJSDate(item.Date);

        const name = item["Holiday Name"];

        if (formattedDate && name) {
          holidayObj[formattedDate] = name;

          holidayArr.push({
            date: formattedDate,
            name: name,
          });

          // Save Holiday Into Database
          await axios.post(`http://localhost:8081/addHolidays`, {
            holidayDate: formattedDate,
            holidayName: name,
          });
        }
      }

      fetchHolidays();
    };

    reader.readAsArrayBuffer(file);
  };

  // filter the holiday for upcoming list
  const today = new Date().toISOString().split("T")[0];

  const upcoming = holidayList.filter((item) => {
    return item.date >= today;
  });
  return (
    <div className="main-container">
      <h1 className="title">Upload Holidays</h1>

      {/* Upload Section */}
      <div className="upload-box">
        <label htmlFor="formFileMultiple" className="form-label">
          Upload the file
        </label>
        <input
          onChange={handleFileUpload}
          className="form-control"
          type="file"
        />
      </div>

      {/* Calendar Section */}
      <div className="row calendar-section">
        <h2 className="calendar-title">Holiday Calendar</h2>

        <div className="col-6 calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date }) => {
              const formatted = formatdate(date);

              if (!formatted) return null;

              return holidays[formatted] ? (
                <p className="holiday-text">{holidays[formatted]}</p>
              ) : null;
            }}
          />
        </div>
        {/* Upcoming */}
        <div className="col-6 upcoming-box">
          <h3>Upcoming Holidays</h3>
          <ul>
            {upcoming.map((item, index) => (
              <li key={index}>
                {item.date}-{item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HolidaysManagement;

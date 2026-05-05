import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/calendar.css"
import * as XLSX from "xlsx";
function HolidaysManagement() {
    const [date, setDate] = useState(new Date()); // Selected Date stored
    const [holidays, setHolidays]= useState({}); // All Object stored in array
    const [holidayList, setHolidayList]= useState([]); //
    

    // const holidays = {
    //     "2026-04-02": "Ram Navmi",
    //     "2026-04-10": "Good Friday",
    //     "2026-04-14": "Ambedkar Jayanti"
    // };


    // Convert into Friendly format which is "YYYY-MM-DD"
    const formatdate = (date) => {
        if (!date) return null;
        return new Date(date).toISOString().split("T")[0];
    };

    const handleFileUpload=(e)=>{
        const file= e.target.files[0];

        const reader= new FileReader();

        reader.onload= (event)=> {
            const data= new Uint8Array(event.target.result);
            const workbook= XLSX.read(data, {type: "array"});

            const sheetName= workbook.SheetName[0];
            const sheet= workbook.Sheets[sheetName];



            const jsonData= XLSX.utils.sheet_to_json(sheet);

            console.log(jsonData); // Debugging Check

            const holidayObj= {};
            const holidayArr= [];


            jsonData.forEach((item)=>{
                const date= item.Date;
                const name= item["Holiday Name"];


                if(date && name){
                    holidayObj[date]= name;

                    holidayArr.push({
                        date, name
                    });
                }
            });

            setHolidays(holidayObj);
            setHolidayList(holidayArr);
        };

        reader.readAsArrayBuffer(file);
    }

    // filter the holiday for upcoming list
    const upcoming = holidayList.filter((item) => {
        return new Date(item.date) >= new Date();
    });
    return (
        <div className="main-container">
            <h1 className="title">Holidays Management</h1>

            {/* Upload Section */}
            <div className="upload-box">
                <label htmlFor="formFileMultiple" className="form-label">
                    Upload the file
                </label>
                <input
                    onChange={handleFileUpload}
                    className="form-control"
                    type="file"
                    id="formFileMultiple"
                    multiple

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
                                <p className="holiday-text">
                                    {holidays[formatted]}
                                </p>
                            ) : null;
                        }}
                    />
                </div>
                {/* Upcoming */}
            <div className="col-6 upcoming-box">
                <h3>Upcoming Holidays</h3>
                        <ul>
                            {upcoming.map((item, index)=>{
                    <li key={index}>
                        {item.date}-{item.name}
                    </li>
                })}
                        </ul>

                
            </div>
            </div>

            
        </div>
    );
}

export default HolidaysManagement;
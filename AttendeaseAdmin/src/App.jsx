import {BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from './layout/Layout';
import Dashboard from './components/Dashboard';
import LeaveManagement from './components/LeaveManagement';
import './App.css'
import HolidaysManagement from './components/HolidaysManagement';
import Employees from './components/Employees';
import MasterManagement from './components/MasterManagement';
import DailyAttendance from './components/DailyAttendance';
import AttendanceReport from './components/AttendanceReport';




function App() {

  return (  
    <BrowserRouter>
    <Routes>
      <Route path="/*"
      element={
         <Layout/>
      }
      >
       <Route path='dashboard' element= {<Dashboard/>}></Route>
       <Route path='LeaveManag' element={<LeaveManagement/>}></Route>
       <Route path='holidays' element={<HolidaysManagement/>}></Route>
        <Route path='masterMmangement' element={<MasterManagement/>}></Route>
        <Route path='Employees' element={<Employees/>}></Route>
        <Route path='dailyAttendance' element={<DailyAttendance/>}></Route>
        <Route path='reports' element={<AttendanceReport/>}></Route>
      </Route>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import SideBar from './components/SideBar'
import Layout from './layout/Layout';
import Dashboard from './components/Dashboard';
import LeaveManagement from './components/LeaveManagement';
import './App.css'
import HolidaysManagement from './components/HolidaysManagement';
import Employees from './components/Employees';
import MasterManagement from './components/MasterManagement';


function App() {

  return (  
    <BrowserRouter>
    <Routes>
      <Route path="/*"
      element={
         <Layout/>
      }
      >
       <Route path='dashbord' element= {<Dashboard/>}></Route>
       <Route path='LeaveManag' element={<LeaveManagement/>}></Route>
       <Route path='holidays' element={<HolidaysManagement/>}></Route>
        <Route path='masterMmangement' element={<MasterManagement/>}></Route>
        <Route path='Employees' element={<Employees/>}></Route>
      </Route>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App

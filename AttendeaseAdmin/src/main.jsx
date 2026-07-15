import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate, useRouteError } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'

function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <img src="/screen.svg" className="animate-spin" alt="" style={{ width: 48, height: 48, marginBottom: 16 }} />
      <h1 style={{ fontSize: 20, color: '#333', marginBottom: 8 }}>Something went wrong</h1>
      <p style={{ color: '#888', fontSize: 14 }}>
        {error?.status === 404 ? 'Page not found' : error?.message || 'Unexpected error'}
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <img src="/screen.svg" className="animate-spin" alt="" style={{ width: 48, height: 48, marginBottom: 16 }} />
      <h1 style={{ fontSize: 20, color: '#333', marginBottom: 8 }}>404 — Page not found</h1>
      <p style={{ color: '#888', fontSize: 14 }}>The page you are looking for does not exist.</p>
    </div>
  );
}
import './index.css'
import Layout from './layout/Layout'
import Dashboard from './components/Dashboard'
import LeaveManagement from './components/LeaveManagement'
import HolidaysManagement from './components/HolidaysManagement'
import Employees from './components/Employees'
import MasterManagement from './components/MasterManagement'
import DailyAttendance from './components/DailyAttendance'
import AttendanceReport from './components/AttendanceReport'
import AdminProfile from './components/AdminProfile'
import Login from './components/Login'

const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'LeaveManag', element: <LeaveManagement /> },
      { path: 'holidays', element: <HolidaysManagement /> },
      { path: 'masterMmangement', element: <MasterManagement /> },
      { path: 'Employees', element: <Employees /> },
      { path: 'dailyAttendance', element: <DailyAttendance /> },
      { path: 'reports', element: <AttendanceReport /> },
      { path: 'profile', element: <AdminProfile /> },
      { path: '*', element: <NotFound /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

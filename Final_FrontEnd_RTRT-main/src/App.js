import { Routes, Route } from 'react-router-dom';
import AdminAllReservations from './AdminAllReservations';
import AdminDashboar from './AdminDashboar';
import AdminReservationPage from './AdminReservationPage';
import './App.css';
import Dashboard from './Dashboard';
import HomePage from './HomePage';
import NotFound from './NotFound';
import ReservationPage from './ReservationPage';
import AuthProvider from './services/AuthContext';
import SignIn from './SignIn';
import UserDetail from './UserDetail';

function App() {
  return (
    <>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="signin" element={<SignIn/>}/>
      <Route path="admin" element={<AdminDashboar/>}/>
      <Route path="reservation" element={<ReservationPage/>}/>
      <Route path="dashboard" element={<Dashboard/>}/>
      <Route path="userdetail" element={<UserDetail/>}/>
      <Route path="adminreservation" element={<AdminReservationPage/>}/>
      <Route path="allreservations" element={<AdminAllReservations/>}/>
      <Route path="*" element={<NotFound/>}  />
    </Routes>
    </AuthProvider>
    </>
  );
}

export default App;

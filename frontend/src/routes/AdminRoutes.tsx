import { Route, Routes } from "react-router-dom";
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import Forbidden from '../pages/errors/Forbidden';

const AdminRoutes = () => (
  <Routes>
    <Route path="" element={<AdminLogin />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="*" element={<Forbidden />} />
  </Routes>
);

export default AdminRoutes;
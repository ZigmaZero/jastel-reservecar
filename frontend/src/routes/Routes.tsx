import { Route, Routes } from "react-router-dom";
import { UserProvider } from '../contexts/UserContext';
import { AdminProvider } from '../contexts/AdminContext';
import NotFound from '../pages/errors/NotFound';
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

const UserLayout = () => (
  <UserProvider>
    <UserRoutes />
  </UserProvider>
);

const AdminLayout = () => (
  <AdminProvider>
    <AdminRoutes />
  </AdminProvider>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/*" element={<UserLayout />} />
    <Route path="/admin/*" element={<AdminLayout />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
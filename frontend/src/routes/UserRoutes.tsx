import { Navigate, Route, Routes } from "react-router-dom";
import Checkin from '../pages/Checkin';
import Checkout from '../pages/Checkout';
import CheckinSuccess from '../pages/CheckinSuccess';
import CheckoutSuccess from '../pages/CheckoutSuccess';
import WaitForVerify from '../pages/WaitForVerify';
import Menu from '../pages/Menu';
import LineLogin from '../pages/LineLogin';
import LineLoginCallback from '../pages/LineLoginCallback';

const UserRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/line/access" replace />} />
    <Route path="/register" element={<Navigate to="/line/access" replace />} />
    <Route path="/login" element={<Navigate to="/line/access" replace />} />
    <Route path="/line/access" element={<LineLogin />} />
    <Route path="/line/callback" element={<LineLoginCallback />} />
    <Route path="/verify" element={<WaitForVerify />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/checkin" element={<Checkin />} />
    <Route path="/checkin-success" element={<CheckinSuccess />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/checkout-success" element={<CheckoutSuccess />} />
  </Routes>
);

export default UserRoutes;
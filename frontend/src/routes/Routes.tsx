import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from '../contexts/UserContext';
import { AdminProvider } from '../contexts/AdminContext';
import NotFound from '../pages/errors/NotFound';
import { Container, Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

// Lazy load route modules
const UserRoutes = lazy(() => import("./UserRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));

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
  <Suspense fallback={        
    <>
      <Navbar showButtons={false} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box textAlign="center">
              <Typography variant="body1">
                  Loading...
              </Typography>
          </Box>
      </Container>
    </>
  }>
    <Routes>
      <Route path="/*" element={<UserLayout />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
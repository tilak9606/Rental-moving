import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home.jsx"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail.jsx"));
const Shortlist = lazy(() => import("./pages/Shortlist.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const MyVisits = lazy(() => import("./pages/tenant/MyVisits.jsx"));
const MoveInInitiate = lazy(() => import("./pages/tenant/MoveInInitiate.jsx"));
const MyMoveIns = lazy(() => import("./pages/tenant/MyMoveIns.jsx"));
const MoveInDetail = lazy(() => import("./pages/tenant/MoveInDetail.jsx"));
const MyTickets = lazy(() => import("./pages/tenant/MyTickets.jsx"));
const LandlordVisits = lazy(
  () => import("./pages/landlord/LandlordVisits.jsx"),
);
const LandlordMoveIns = lazy(
  () => import("./pages/landlord/LandlordMoveIns.jsx"),
);
const MyProperties = lazy(() => import("./pages/landlord/MyProperties.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Tenant Routes */}
              <Route
                path="/shortlist"
                element={
                  <ProtectedRoute roles={["tenant"]}>
                    <Shortlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-visits"
                element={
                  <ProtectedRoute roles={["tenant"]}>
                    <MyVisits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movein/initiate"
                element={
                  <ProtectedRoute roles={["tenant"]}>
                    <MoveInInitiate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-moveins"
                element={
                  <ProtectedRoute roles={["tenant"]}>
                    <MyMoveIns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movein/:id"
                element={
                  <ProtectedRoute roles={["tenant"]}>
                    <MoveInDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute roles={["tenant"]}>
                    <MyTickets />
                  </ProtectedRoute>
                }
              />

              {/* Landlord Routes */}
              <Route
                path="/landlord-visits"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <LandlordVisits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord-moveins"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <LandlordMoveIns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-properties"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <MyProperties />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

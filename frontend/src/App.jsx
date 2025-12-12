// frontend/src/App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

// Components
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesList from "./pages/NotesList";
import UploadNotes from "./pages/UploadNotes";
import MyNotes from "./pages/MyNotes";
import AdminPanel from "./pages/AdminPanel";
import SubjectNotes from "./pages/SubjectNotes";

/* ------------------ Layout with Navbar after login ------------------ */
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

/* ------------------ ROUTER SETUP ------------------ */
const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      /* PUBLIC ROUTES (No Navbar here) */
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      /* USER-PROTECTED ROUTES */
      {
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { path: "/dashboard", element: <NotesList /> },
          { path: "/upload", element: <UploadNotes /> },
          { path: "/mine", element: <MyNotes /> },

          // ⭐ FIXED SUBJECT ROUTE
          { path: "/subject/:id", element: <SubjectNotes /> },
        ],
      },

      /* ADMIN ROUTES */
      {
        element: (
          <AdminRoute>
            <Layout />
          </AdminRoute>
        ),
        children: [{ path: "/admin", element: <AdminPanel /> }],
      },

      /* 404 FALLBACK */
      { path: "*", element: <h2 style={{ textAlign: "center" }}>404 Not Found</h2> },
    ],
  },
]);

/* ------------------ APP ------------------ */
export default function App() {
  return <RouterProvider router={router} />;
}

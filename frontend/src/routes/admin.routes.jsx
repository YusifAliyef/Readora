import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3300";

function AdminProtectedRoute() {
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setStatus("unauthorized");
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.isValid && res.data.user?.role === "admin") {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      } catch (err) {
        setStatus("unauthorized");
      }
    };

    verify();
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "#6b6560",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Yoxlanılır...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
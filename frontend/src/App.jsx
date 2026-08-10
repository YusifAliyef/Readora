import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#14110f",
            color: "#f6f1e4",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 600,
            padding: "14px 20px",
            borderRadius: "14px",
            boxShadow: "0 20px 40px rgba(20, 17, 15, 0.25)",
            border: "1px solid rgba(200, 162, 77, 0.25)",
          },
          success: {
            iconTheme: {
              primary: "#c8a24d",
              secondary: "#14110f",
            },
          },
          error: {
            iconTheme: {
              primary: "#7c2d3a",
              secondary: "#f6f1e4",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

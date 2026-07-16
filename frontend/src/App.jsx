import React from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
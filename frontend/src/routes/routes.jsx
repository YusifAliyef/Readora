import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayouts";
import Home from "../pages/Homepage";
import Books from "../pages/Books";
import MyReservations from "../pages/MyReservations";
import About from "../pages/Aboutpage";
import Contact from "../pages/Contactpage";
import Favorites from "../pages/Favorites";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/my-reservations",
        element: <MyReservations />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
    ],
  },
]);

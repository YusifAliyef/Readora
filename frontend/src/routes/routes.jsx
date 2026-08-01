import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayouts";
import AdminLayout from "../layouts/AdminLayouts";
import AdminProtectedRoute from "./admin.routes";
import Home from "../pages/Homepage";
import Books from "../pages/Books";
import MyReservations from "../pages/MyReservations";
import Loans from "../pages/Loans";
{
  /* ← ƏLAVƏ OLUNDU */
}
import About from "../pages/Aboutpage";
import Contact from "../pages/Contactpage";
import Favorites from "../pages/Favorites";
import Register from "../pages/Admin/Register";
import Login from "../pages/Admin/Login";
import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminBooksManage from "../pages/Admin/BooksManage";
import AdminReservationsManage from "../pages/Admin/ReservationsManage";
import AdminLoansManage from "../pages/Admin/LoanManage";
import BookReviews from "../pages/BookReviews";
import MyReviews from "../pages/MyReviews";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <Books /> },
      { path: "/my-reservations", element: <MyReservations /> },
      { path: "/loans", element: <Loans /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/books/:bookId/reviews", element: <BookReviews /> },
      { path: "/my-reviews", element: <MyReviews /> },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "books", element: <AdminBooksManage /> },
          { path: "reservations", element: <AdminReservationsManage /> },
          { path: "loans", element: <AdminLoansManage /> },
        ],
      },
    ],
  },
]);

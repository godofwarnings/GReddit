import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const PublicRoutes = ({ children, userStatus }) => {
   console.log("tried to access", userStatus)
   return !userStatus ? <>{children}</> : <Navigate to="/profile"/>;
};

export default PublicRoutes;

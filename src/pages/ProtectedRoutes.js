import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const ProtectedRoutes = ({children, userStatus}) => {
   console.log("tried to access", userStatus)
   return userStatus ? <>{children}</> : <Navigate to="/login"/>;
};

export default ProtectedRoutes;

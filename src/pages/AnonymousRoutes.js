import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const AnonymousGuard = () => {
   const { user } = useContext(AuthContext);
   return user.user ? (
      <Navigate to="/profile" replace />
   ) : (
      <Outlet />
   );
};

export default AnonymousGuard
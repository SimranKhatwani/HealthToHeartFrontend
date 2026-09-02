import { Navigate } from "react-router-dom";
import { useGetRolePermissionsQuery } from "./redux/slices/roleSlice";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ permission, children }) => {
  const { data : permissionsData } = useGetRolePermissionsQuery();
  const { role } = useSelector((state) => state.role);

  // if the user does not have the required permission, redirect to the home page
  if (!(permissionsData?.permissionsspecial.includes(permission) || role === "superadmin" || role === "admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

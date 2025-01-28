import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAdmin, children }) {
  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

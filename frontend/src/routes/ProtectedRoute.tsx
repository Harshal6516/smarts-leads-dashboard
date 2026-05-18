import {
  Navigate,
} from "react-router-dom";

import { ReactNode } from "react";

import { useAuthStore } from "../store/authStore";

interface Props {
  children: ReactNode;
}

function ProtectedRoute({
  children,
}: Props) {
  const token =
    useAuthStore(
      (state) => state.token
    );

  if (!token) {
    return (
      <Navigate to="/login" />
    );
  }

  return children;
}

export default ProtectedRoute;
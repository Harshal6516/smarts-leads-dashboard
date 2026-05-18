import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import {
  useAuthStore,
} from "./store/authStore";

function App() {
  const token =
    useAuthStore(
      (state) => state.token
    );

  const fetchCurrentUser =
    useAuthStore(
      (state) =>
        state.fetchCurrentUser
    );

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={
            <RegisterPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
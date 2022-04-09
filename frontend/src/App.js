import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Verification from "./pages/Verification/Verification";
import Rooms from "./pages/Rooms/Rooms";
import React from "react";
import { useLoadingWithRefresh } from "./hooks/useLoading";
import Loader from "./components/shared/Loader/Loader";
import Room from "./pages/Room/Room";

function App() {
  const { loading } = useLoadingWithRefresh();

  return loading ? (
    <Loader message={"Please wait while we get things ready for you..."} />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route exact element={<GuestRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<Verification />} />
        </Route>

        <Route element={<SemiProtectedRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:id" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function GuestRoute() {
  const { isAuth } = useSelector((state) => state.auth);

  const location = useLocation();
  return isAuth ? (
    <Navigate to="/rooms" state={{ from: location }} />
  ) : (
    <Outlet />
  );
}

const SemiProtectedRoute = () => {
  const { isAuth, user } = useSelector((state) => state.auth);

  const location = useLocation();
  return !isAuth ? (
    <Navigate to="/" state={{ from: location }} />
  ) : isAuth && !user.activated ? (
    <Outlet />
  ) : (
    <Navigate to="/rooms" state={{ from: location }} />
  );
};

const ProtectedRoute = () => {
  const { isAuth, user } = useSelector((state) => state.auth);

  const location = useLocation();
  return !isAuth ? (
    <Navigate to="/" state={{ from: location }} />
  ) : isAuth && !user.activated ? (
    <Navigate to="/register" state={{ from: location }} />
  ) : (
    <Outlet />
  );
};

export default App;

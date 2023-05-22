import { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";

const Routing = () => {
  const accessToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Home if access token is present
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate]);

  return (
    <Routes>
      {accessToken ? (
        <Route path="/home" exact element={<Home />} />
      ) : (
        <Route path="/login" exact element={<Login />} />
      )}
      <Route
        path="/"
        element={
          accessToken ? <Navigate to="/home" /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default Routing;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove stale authentication data on load
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }, []);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/csrf-token/", { withCredentials: true });
      if (response.data.csrfToken) {
        document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
        return response.data.csrfToken;
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) {
        throw new Error("CSRF token missing. Please refresh the page.");
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      storeUserData(data);
      await showSuccessAlert();
      navigate("/dashboard");
    } catch (error: any) {
      showErrorAlert(error.response?.data?.detail || "Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const storeUserData = (data: { token: string; user: object }) => {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const showSuccessAlert = async () => {
    await Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "You have successfully logged in!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const showErrorAlert = (message: string) => {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: message,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

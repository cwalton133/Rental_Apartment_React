import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone_number: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }
        
        // Fetch CSRF token
        const csrfResponse = await axios.get("http://127.0.0.1:8000/api/csrf-token/", { withCredentials: true });
        if (csrfResponse.data.csrfToken) {
          document.cookie = `csrftoken=${csrfResponse.data.csrfToken}; path=/`;
        }

        const headers = {
          "Authorization": `Bearer ${authToken}`,
        };

        // Fetch user profile
        const userResponse = await axios.get("http://127.0.0.1:8000/api/users/me/", { headers, withCredentials: true });
        const profileResponse = await axios.get("http://127.0.0.1:8000/api/addresses/", { headers, withCredentials: true });

        setProfile({
          full_name: userResponse.data.full_name,
          email: userResponse.data.email,
          phone_number: userResponse.data.phone_number || "",
          address: profileResponse.data.address || "",
          city: profileResponse.data.city || "",
          state: profileResponse.data.state || "",
          zipcode: profileResponse.data.zipcode || "",
          country: profileResponse.data.country || "",
        });
      } catch (error) {
        setError("Failed to load profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Unauthorized. Please log in.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      };

      await axios.put("http://127.0.0.1:8000/api/profile/update/", profile, { headers, withCredentials: true });
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile. Check your credentials.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Profile</h2>
      {loading && <Spinner animation="border" />} 
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="full_name" value={profile.full_name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={profile.email} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="text" name="phone_number" value={profile.phone_number} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={profile.address} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control type="text" name="city" value={profile.city} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>State</Form.Label>
          <Form.Control type="text" name="state" value={profile.state} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Zip Code</Form.Label>
          <Form.Control type="text" name="zipcode" value={profile.zipcode} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control type="text" name="country" value={profile.country} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update Profile
        </Button>
      </Form>
    </div>
  );
};

export default Profile;

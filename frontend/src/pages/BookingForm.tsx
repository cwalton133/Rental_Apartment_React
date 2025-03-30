import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get Property ID from URL

  const [formData, setFormData] = useState({ checkin: "", checkout: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");

  const [user, setUser] = useState<{ full_name: string } | null>(null);
  const [property, setProperty] = useState<{
    title: string;
    price: number;
    image: string;
  } | null>(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      alert("You must log in first!");
      navigate("/login");
      return;
    }

    // ✅ Fetch CSRF Token
    axios
      .get("http://127.0.0.1:8000/api/csrf-token/", { withCredentials: true })
      .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error("Error fetching CSRF token:", err));

    // ✅ Fetch User Details
    axios
      .get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user details:", err));

    // ✅ Fetch Property Details
    axios
      .get(`http://127.0.0.1:8000/api/properties/${id}/`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error("Error fetching property:", err));

    // ✅ Fetch Existing Bookings
    axios
      .get("http://127.0.0.1:8000/api/bookings/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setExistingBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [navigate, token, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    const totalDays =
      (new Date(formData.checkout).getTime() - new Date(formData.checkin).getTime()) /
      (1000 * 60 * 60 * 24);

    if (totalDays <= 0) {
      setError("Check-out date must be after the check-in date.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings/",
        {
          property: id,
          check_in_date: formData.checkin,
          check_out_date: formData.checkout,
          days: totalDays,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            Authorization: `Token ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log("Booking successful:", response.data);
        setSuccess(true);
        setExistingBookings([...existingBookings, response.data]);
        setFormData({ checkin: "", checkout: "" });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to book the property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>Book a Property</h2>

      {/* ✅ Show User's Full Name */}
      <h4>Welcome, {user ? user.full_name : "Guest"}!</h4>

      {/* ✅ Show Property Details */}
      {property && (
        <Card className="mb-3">
          <Card.Img variant="top" src={property.image} style={{ height: "150px", objectFit: "cover" }} />
          <Card.Body>
            <Card.Title>{property.title}</Card.Title>
            <Card.Text>Price: ${property.price} per night</Card.Text>
          </Card.Body>
        </Card>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Booking confirmed!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Check-in</Form.Label>
          <Form.Control
            type="date"
            name="checkin"
            value={formData.checkin}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Check-out</Form.Label>
          <Form.Control
            type="date"
            name="checkout"
            value={formData.checkout}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </Button>
      </Form>

      {/* Display existing bookings */}
      <h3 className="mt-4">Your Existing Bookings</h3>
      {existingBookings.length > 0 ? (
        <ul>
          {existingBookings.map((booking) => (
            <li key={booking.id}>
              {booking.check_in_date} to {booking.check_out_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No existing bookings found.</p>
      )}
    </Container>
  );
};

export default BookingForm;

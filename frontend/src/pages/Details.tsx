import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

interface Booking {
  id: number;
  property: {
    id: number;
    title: string;
    address: string;
    image_url: string;
    price_per_night: number;
  };
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve token from localStorage
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      alert("You must log in first!");
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [navigate, token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/bookings/", {
        headers: { Authorization: `Token ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-4">
      <h2>My Bookings</h2>
      <Row>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Col md={6} lg={4} key={booking.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={booking.property.image_url} alt={booking.property.title} />
                <Card.Body>
                  <Card.Title>{booking.property.title}</Card.Title>
                  <Card.Text>
                    <strong>Address:</strong> {booking.property.address} <br />
                    <strong>Check-in:</strong> {booking.check_in_date} <br />
                    <strong>Check-out:</strong> {booking.check_out_date} <br />
                    <strong>Total Price:</strong> ${booking.total_price} <br />
                    <strong>Status:</strong>{" "}
                    <span className={booking.status === "paid" ? "text-success" : "text-danger"}>
                      {booking.status}
                    </span>
                  </Card.Text>
                  {booking.status !== "paid" && (
                    <Button variant="success" onClick={() => navigate(`/payment/${booking.id}`)}>
                      Make Payment
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;

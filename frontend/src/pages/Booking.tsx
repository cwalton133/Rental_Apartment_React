import React, { useEffect, useState } from "react";
import { Button, Card, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get Property ID from URL

  const [property, setProperty] = useState<{
    title: string;
    price_per_night: number;
    image: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Fetch Property Details
    axios
      .get(`http://127.0.0.1:8000/api/properties/${id}/`)
      .then((res) => {
        console.log("API Response:", res.data); // ✅ Debugging API response
        setProperty(res.data);
      })
      .catch((err) => {
        console.error("Error fetching property:", err);
        setError("Failed to load property details.");
      });
  }, [id]);

  // ✅ Handle Booking Navigation
  const handleBookNow = () => {
    navigate(`/payment/${id}`); // ✅ Redirect to Payment.tsx with Property ID
  };

  return (
    <Container>
      <h2>Booking Property ID: {id}</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* ✅ Show Property Details */}
      {property && (
        <Card className="mb-3">
          <Card.Img variant="top" src={property.image} style={{ height: "200px", objectFit: "cover" }} />
          <Card.Body>
            <Card.Title>{property.title}</Card.Title>
            <Card.Text>Price: ${property.price_per_night} per night</Card.Text> {/* ✅ Fixed price display */}
            {/* ✅ Redirect to Payment.tsx */}
            <Button variant="primary" onClick={handleBookNow}>
              Book Now
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Booking;

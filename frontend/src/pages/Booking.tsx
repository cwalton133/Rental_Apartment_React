import React, { useEffect, useState } from "react";
import { Button, Card, Container, Alert, Table, Form } from "react-bootstrap";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

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

  // ✅ Calculate total price based on date selection
  useEffect(() => {
    if (startDate && endDate && property) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      setTotalPrice(days * property.price_per_night);
    }
  }, [startDate, endDate, property]);

  // ✅ Handle Booking Navigation
  const handleBookNow = () => {
    navigate(`/payment/${id}?startDate=${startDate}&endDate=${endDate}&totalPrice=${totalPrice}`);
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
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Price per Night</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${property.price_per_night}</td>
                  <td>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </td>
                  <td>${totalPrice}</td>
                </tr>
              </tbody>
            </Table>
            <Button variant="primary" onClick={handleBookNow} disabled={!startDate || !endDate || totalPrice === 0}>
              Book Now
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Booking;
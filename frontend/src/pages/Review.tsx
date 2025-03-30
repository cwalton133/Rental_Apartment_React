// Review.tsx
import React, { useEffect, useState } from "react";
import { Card, Button, Form, Container, Spinner } from "react-bootstrap";
import axios from "axios";

const Review: React.FC = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/property-reviews/")
      .then(res => setReviews(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/api/property-reviews/", { text: newReview })
      .then(() => setNewReview(""));
  };

  return (
    <Container>
      <h2>Property Reviews</h2>
      {loading ? <Spinner animation="border" /> : reviews.map((rev, i) => (
        <Card key={i} className="mb-3">
          <Card.Body>{rev.text}</Card.Body>
        </Card>
      ))}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control value={newReview} onChange={(e) => setNewReview(e.target.value)} placeholder="Write a review..." />
        </Form.Group>
        <Button type="submit" className="mt-2">Submit</Button>
      </Form>
    </Container>
  );
};

export default Review;

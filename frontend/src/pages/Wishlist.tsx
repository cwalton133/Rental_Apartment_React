import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

type WishlistItem = {
  id: number;
  property: {
    id: number;
    title: string;
    location: string;
    image: string;
  };
};

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/wishlists/", {
          withCredentials: true,
          headers: {
            "Authorization": `Token ${authToken}`,
          },
        });

        setWishlist(response.data);
      } catch (error) {
        setError("Failed to fetch wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Your Wishlist</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="row">
        {wishlist.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <Card>
              <Card.Img variant="top" src={item.property.image} alt={item.property.title} />
              <Card.Body>
                <Card.Title>{item.property.title}</Card.Title>
                <Card.Text>{item.property.location}</Card.Text>
                <Link to={`/wishlist/:id/${item.property.id}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

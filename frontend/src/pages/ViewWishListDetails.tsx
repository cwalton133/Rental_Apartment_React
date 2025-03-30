import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  amenities: string[];
}

const ViewWishListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/properties/${id}/`, {
          withCredentials: true,
          headers: {
            "Authorization": `Token ${authToken}`,
          },
        });

        setProperty(response.data);
      } catch (error) {
        setError("Failed to fetch property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      {property && (
        <Card>
          <Card.Img variant="top" src={property.image} alt={property.title} />
          <Card.Body>
            <Card.Title>{property.title}</Card.Title>
            <Card.Text>{property.description}</Card.Text>
            <Card.Text><strong>Location:</strong> {property.location}</Card.Text>
            <Card.Text><strong>Price:</strong> ${property.price}</Card.Text>
            <Card.Text>
              <strong>Amenities:</strong> {property.amenities.join(", ")}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ViewWishListDetails;

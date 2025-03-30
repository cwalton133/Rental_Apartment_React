import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

interface Property {
  id: number;
  title: string;
  description: string;
  images: string[]; // Property now has an array of images
}

const BASE_URL = "http://localhost:8000"; // Update with your Django backend URL

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesResponse = await axios.get(`${BASE_URL}/api/properties/`);
        const propertiesData = propertiesResponse.data;

        // Fetch images for each property
        const propertiesWithImages = await Promise.all(
          propertiesData.map(async (property: any) => {
            try {
              const imagesResponse = await axios.get(`${BASE_URL}/api/property-images/?property=${property.id}`);
              return {
                ...property,
                images: imagesResponse.data.length > 0 
                  ? imagesResponse.data.map((img: any) => `${BASE_URL}${img.image_url}`) 
                  : ["https://via.placeholder.com/300"], // Placeholder if no images
              };
            } catch (error) {
              console.error(`Error fetching images for property ${property.id}:`, error);
              return { ...property, images: ["https://via.placeholder.com/300"] };
            }
          })
        );

        setProperties(propertiesWithImages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" />
        <h2>Loading properties...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Hero Section */}
      <div className="hero-section text-center py-5 mb-5 bg-light rounded">
        <h1 className="display-4">Find Your Dream Rental</h1>
        <p className="lead">Explore the best apartments for rent at affordable prices.</p>
        <Link to="/listing">
          <Button variant="primary" size="lg">Browse Listings</Button>
        </Link>
      </div>

      {/* Featured Listings */}
      <h2 className="mb-4">Featured Properties</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {properties.map((property) => (
          <Col key={property.id}>
            <Card className="property-card">
              <Card.Img
                variant="top"
                src={property.images[0]} // Displays the first image
                alt={property.title}
                className="property-image"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300")}
              />
              <Card.Body>
                <Card.Title>{property.title}</Card.Title>
                <Card.Text>{property.description}</Card.Text>
                <Link to={`/property/${property.id}`}>
                  <Button variant="outline-primary" className="w-100">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Row, Col, Carousel } from "react-bootstrap";
import { FaMapMarkerAlt, FaBed, FaBath, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        // Fetch property details and images
        const [propertyRes, imagesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/properties/${id}/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(`http://127.0.0.1:8000/api/property-images/?property=${id}`, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        setProperty(propertyRes.data);

        console.log("Property Data:", propertyRes.data); // Debugging: Check Property API response
        console.log("Image API Response:", imagesRes.data); // Debugging: Check Image API response

        // Extract additional images
        const extractedImages = imagesRes.data.map((img: any) => img.image);
        
        // Use property.image as the first image, then additional images
        const allImages = propertyRes.data.image
          ? [propertyRes.data.image, ...extractedImages]
          : extractedImages.length > 0
          ? extractedImages
          : ["https://via.placeholder.com/600"];

        setImages(allImages);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Property not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            {/* Image Carousel */}
            <Col md={6}>
              <Carousel>
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={image} alt={`Property Image ${index}`} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>

            {/* Property Details */}
            <Col md={6}>
              <Card.Title>{property.title}</Card.Title>
              <p><FaMapMarkerAlt /> {property.address}</p>
              <p><FaMoneyBillWave /> ${property.price_per_night} / night</p>
              <p><FaBed /> {property.bedrooms} Beds</p>
              <p><FaBath /> {property.bathrooms} Baths</p>
              <p>{property.description}</p>
              <Button variant="primary" onClick={() => navigate(`/booking/${id}`)}>Book Now</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PropertyDetails;

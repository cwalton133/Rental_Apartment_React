// src/pages/About.tsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About: React.FC = () => {


  
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">About AirNest Realty</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Who We Are</Card.Title>
              <Card.Text>
                AirNest Realty is a leading platform for apartment rentals, connecting guests with top-tier properties.
                Whether you're looking for a short-term stay or a long-term rental, we provide the best deals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                Our mission is to simplify the rental process by providing a seamless booking experience, secure payments,
                and verified property listings.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Why Choose Us?</Card.Title>
              <ul>
                <li>Wide selection of high-quality properties</li>
                <li>Secure and easy booking process</li>
                <li>Trusted by thousands of satisfied customers</li>
                <li>24/7 customer support</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;

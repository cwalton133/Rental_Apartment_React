// src/components/Footer.tsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <p className="mb-0">© {new Date().getFullYear()} AirNest Realty. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="https://facebook.com" className="text-light me-3">Facebook</a>
            <a href="https://twitter.com" className="text-light me-3">Twitter</a>
            <a href="https://instagram.com" className="text-light">Instagram</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

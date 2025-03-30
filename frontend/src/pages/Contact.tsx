import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Contact: React.FC = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Contact Us</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Write your message here..." />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;

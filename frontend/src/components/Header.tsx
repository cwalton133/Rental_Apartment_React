import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          AirNest Realty
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authToken ? (
              <>
                <NavDropdown title="Account" id="basic-nav-dropdown" className="me-3">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/change-password">
                    Change Password
                  </NavDropdown.Item>
                   <NavDropdown.Item as={Link} to="/wishlist">
                    WishList
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/dashboard">
                    View Listings
                  </NavDropdown.Item>
                </NavDropdown>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="d-flex ms-3">
                <Link to="/login">
                  <Button variant="outline-light" className="me-2">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "react-bootstrap";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Container className="mt-4">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default Layout;

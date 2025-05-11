import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import "../App.css";
import "./contact.css";

function handleLogout(){
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userEmail");
  window.location.reload();
  navigate("/home");
}

function ContactPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userName");
    if (sessionUser) {
      setUser(sessionUser);
    }
    
  }, []);

  return (
    <div className="contact">
      <Navbar bg="light" expand="lg" className="border-bottom shadow-sm px-4 mb-5">
        <Navbar.Brand className="text-success fw-bold fs-3">ProGig</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link fs-5 mx-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link fs-5 mx-3">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link fs-5 mx-3">
              Contact Us
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center me-5">
            {user ? (
              <Dropdown className="me-5">
                <Dropdown.Toggle
                  variant="link"
                  className="text-success fw-bold fs-5 p-0 m-0"
                  id="dropdown-basic"
                  style={{ textDecoration: "none" }}
                >
                  {user}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/buyer/profile">
                    Buyer Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/seller/profile">
                    Seller Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline-success" className="me-2">
                    Login
                  </Button>
                </Link>
                <Link to="/signUp">
                  <Button variant="outline-warning">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container className="contact-container mt-5">
        <h1 className="mb-4">Contact Us</h1>
        <p>
          <span className="contact-header">Get in Touch</span>
          <span className="contact-content">
            Have questions or need assistance? We’re here to help! Whether you’re a freelancer looking for
            opportunities or a business seeking top talent, feel free to reach out to us.
          </span>

          <span className="contact-header">How to Reach Us</span>
          <span className="contact-content-pt">
            📍 Address: 14, West Street, Virudhunagar - 626001.
            <br />
            📞 Phone: +91 1234567890
            <br />
            ✉ Email: manoj@example.com
            <br />
          </span>

          <span className="contact-header">Support & Assistance</span>
          <span className="contact-content-pt">
            💬 Live Chat: Available 24/7 for quick support.
            <br />
            📩 Help Desk: Submit a ticket, and our team will get back to you.
            <br />
            🔗 FAQs: Find answers to common questions in our [FAQ section].
            <br />
          </span>

          <span className="contact-header">Follow Us</span>
          <span className="contact-content-pt">
            Stay connected with us on social media for the latest updates:
            <br />
            🔹 Facebook: [Your Facebook Link]
            <br />
            🔹 Twitter/X: [Your Twitter Link]
            <br />
            🔹 LinkedIn: [Your LinkedIn Link]
            <br />
            🔹 Instagram: [Your Instagram Link]
            <br />
          </span>

          <span className="contact-header">Send Us a Message</span>
          <span className="contact-content">
            Fill out the form below, and we’ll get back to you as soon as possible.
          </span>

        </p>
      </Container>
    </div>
  );
}

function Contact() {
  return <ContactPage />;
}

export default Contact;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button, Row, Col, Dropdown } from "react-bootstrap";
import "./about.css";
import "../App.css";

function handleLogout(){
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userEmail");
  window.location.reload();
  navigate("/home");

}

function AboutPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userName");
    if (sessionUser) {
      setUser(sessionUser);
    }
    
  }, []);

  return (
    <div className="about">
      <Navbar bg="light" expand="lg" className="border-bottom shadow-sm px-4 mb-5">
        <Navbar.Brand className="text-success fw-bold fs-3">ProGig</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link fs-5 mx-3">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link fs-5 mx-3">About</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link fs-5 mx-3">Contact Us</Nav.Link>
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

      <Container className="about-container mt-5">
        <h1 className="mb-4">About Us</h1>

        <p>
          <span className="body-header">Empowering Freelancers, Connecting Businesses</span>
          <br />
          <span className="body-content">
            Welcome to ProGig - freelancer marketplace, the ultimate platform where talent meets opportunity.
            Whether you're a skilled freelancer looking for work or a business searching for top-notch professionals,
            we've got you covered.
          </span>

          <span className="body-header">Who We Are</span>
          <br />
          <span className="body-content">
            ProGig is a dynamic marketplace built to bridge the gap between businesses and freelancers.
            We believe in the power of independent work and the value it brings to both individuals and organizations.
            Our platform enables seamless collaboration, ensuring businesses get high-quality services while freelancers
            find rewarding projects.
          </span>

          <span className="body-header">Our Mission</span>
          <br />
          <span className="body-content-pt">
            We aim to create a fair, transparent, and efficient marketplace where:
            <br />✅ Freelancers can showcase their skills and get hired for projects that match their expertise.
            <br />✅ Businesses can access a diverse pool of talented professionals without the hassle of traditional hiring.
            <br />✅ Secure payments and smooth communication make the freelancing experience stress-free.
          </span>

          <span className="body-header">Why Choose Us?</span>
          <br />
          <span className="body-content-pt">
            ✔ <u>Diverse Talent Pool:</u> Connect with experts across various fields, from design and development to marketing and content writing.
            <br />
            ✔ <u>Safe & Secure:</u> Our escrow system ensures that freelancers get paid on time and clients receive high-quality work.
            <br />
            ✔ <u>User-Friendly Platform:</u> Our easy-to-use interface makes it simple to post projects, manage work, and communicate.
            <br />
            ✔ <u>Affordable & Transparent:</u> No hidden fees—just a fair and efficient system that benefits everyone.
          </span>

          <span className="body-header">Join Us Today!</span>
          <br />
          <span className="body-content">
            Whether you're a freelancer looking for your next gig or a business seeking the best talent,
            ProGig is the place to be. Sign up now and be part of the future of freelancing!
          </span>
        </p>
      </Container>
    </div>
  );
}

function About() {
  return <AboutPage />;
}

export default About;

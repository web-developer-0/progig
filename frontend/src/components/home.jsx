import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Button,
  NavDropdown,
  Dropdown,
  Row,
  Col,
  Card,
} from "react-bootstrap";



function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  const [gigs, setGigs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userName");
    const sessionEmail = sessionStorage.getItem("userEmail");
    if (sessionUser) {
      setUser(sessionUser);
      setEmail(sessionEmail);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  }

  const getAllGigs = async () => {
    try {
      const response = await fetch("http://localhost:5000/allGigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // ✅ Use correct key
      });

      const data = await response.json();

      setGigs(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllGigs();
  }, []);
  

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className="border-bottom shadow-sm px-4 mb-5"
      >
        <Navbar.Brand className="text-success fw-bold fs-3">
          ProGig
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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

      <Container className="text-center">
        <Row className="d-flex justify-content-center">
          {gigs ? (

              gigs.map((gig, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-5">
              <Card className="mb-4 shadow-lg h-100">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${gig.image}`}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "contain",
                    padding: "10px",
                  }}
                />

                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title
                      style={{
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {gig.title}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      by <strong>{gig.username}</strong>
                    </Card.Text>
                  </div>
                  <Button
                    variant="success"
                    as={Link}
                    to={{pathname: `/gig`, search : `?val=${gig._id}`}}
                    className="mt-auto"
                  >
                    View Gig  
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            ))

          ) : (
            <p> Loading Gig Datas.... </p>
          )}
          
        </Row>
      </Container>
    </>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Dropdown,
  Row,
  Col,
  Card,
  Form,
} from "react-bootstrap";

import img from "./profile.png";

function SellerProfile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [sellerDetails, setSellerDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userName");
    const sessionEmail = sessionStorage.getItem("userEmail");
    if (sessionUser) {
      setUser(sessionUser);
      setEmail(sessionEmail);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchBuyerDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/BuyerDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (data.message == true) {
        setSellerDetails({
          name: data.name,
          username: data.username,
          email: data.email,
          totalGigsCreated: data.totalGigsCreated, //data.GigsBuyed,
          totalAmountEarned: data.totalAmountEarned, //data.AmountSpend,
        });
      } else if (data.message == false) {
        console.log("message False");
      }
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  fetchBuyerDetails();

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

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
            <Nav.Link
              as={Link}
              to="/seller/profile"
              className="nav-link fs-5 mx-3"
            >
              Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/seller/createGig"
              className="nav-link fs-5 mx-3"
            >
              Create Gig
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/seller/yourGigs"
              className="nav-link fs-5 mx-3"
            >
              Your Gigs
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/seller/orders"
              className="nav-link fs-5 mx-3"
            >
              Orders
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center me-5">
            {user && (
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
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <h2 className="mb-5 text-center">Profile</h2>

        {sellerDetails ? (
          <>
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs="auto" className="pe-3">
                <img
                  src={img}
                  alt="Profile"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={6} className="text-start" style={{ fontSize: "22px" }}>
                <Row className="g-2">
                  <Col xs={6} className="text-end">
                    <p>
                      <strong>Name :</strong>
                    </p>
                    <p>
                      <strong>Username :</strong>
                    </p>
                    <p>
                      <strong>Email :</strong>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p>{sellerDetails.name}</p>
                    <p>{sellerDetails.username}</p>
                    <p>{sellerDetails.email}</p>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="mt-5 justify-content-center">
              <Col
                xs={12}
                md={5}
                lg={4}
                className="mb-4 d-flex justify-content-center"
              >
                <Card
                  className="pe-4"
                  style={{
                    width: "200%",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Card.Body>
                    <Card.Title>Your Gigs</Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "34px",
                        fontWeight: "bold",
                        color: "green",
                      }}
                    >
                      {sellerDetails.totalGigsCreated}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col
                xs={12}
                md={5}
                lg={4}
                className="mb-4 d-flex justify-content-center"
              >
                <Card
                  className="ps-4"
                  style={{
                    width: "200%",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Card.Body>
                    <Card.Title>Total Earnings</Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "34px",
                        fontWeight: "bold",
                        color: "green",
                      }}
                    >
                      ₹ {sellerDetails.totalAmountEarned}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <p> Loading Profile Data.... </p>
        )}
      </Container>
    </>
  );
}

export default SellerProfile;

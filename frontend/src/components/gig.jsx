import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
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

function Gig() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [gigDetails, setGigDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userName");
    const sessionEmail = sessionStorage.getItem("userEmail");
    if (sessionUser) {
      setUser(sessionUser);
      setEmail(sessionEmail);
    } else {
      navigate("/login");
    }

    // Get gig_id from query string
    const queryParams = new URLSearchParams(location.search);
    const gigId = queryParams.get("val");

    if (gigId) {
      fetchGigDetails(gigId);
    } else {
      setError("No gig_id provided in URL");
      setGigDetails(null);
      setIsLoading(false);
    }
  }, [navigate, location]);

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  const fetchGigDetails = async (gigId) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/GigDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gig_id: gigId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch gig details");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No gig data returned");
      }

      // Ensure data is an object, not an array
      const gigData = Array.isArray(data) ? data[0] : data;

      setGigDetails(gigData);
      setError(null);
    } catch (err) {
      console.error("Error fetching gig details:", err);
      setError(err.message);
      setGigDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    // Get gig_id from query string
    const queryParams = new URLSearchParams(location.search);
    const gigId = queryParams.get("val");

    if (!gigId || !user || !email) {
      setError("Missing required information to add to cart");
      return;
    }

    const gig_creator = gigDetails.username;

    if (gig_creator == user) {
      alert("You can't order this. Because It is Yours.");
    } else {
      try {
        const response = await fetch("http://localhost:5000/AddToCart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user,
            gig_id: gigId,
            email: email,
            gig_creator: gig_creator,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to add gig to cart");
        }

        if (data.message) {
          alert("Gig added to the Cart");
          navigate("/buyer/cart");
          window.location.reload();
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        setError(err.message);
      }
    }
  };

  // Log state changes
  useEffect(() => {
    console.log(
      "Current state - isLoading:",
      isLoading,
      "error:",
      error,
      "gigDetails:",
      gigDetails
    );
  }, [isLoading, error, gigDetails]);

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className="border-bottom shadow-sm px-4 mb-5"
      >
        <Container fluid>
          <Navbar.Brand className="text-success fw-bold fs-3">
            ProGig
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto  me-5">
              {user && (
                <Dropdown as={Nav.Item}>
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {isLoading ? (
          <p>Loading gig details...</p>
        ) : error ? (
          <p className="text-danger">Error: {error}</p>
        ) : gigDetails ? (
          <div style={{ border: "2px solid green", padding: "10px" }}>
            <h3>Gig Details</h3>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Title:</strong> {gigDetails.title || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {gigDetails.description || "N/A"}
                </p>
                <p>
                  <strong>Category:</strong> {gigDetails.category || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ${gigDetails.price || "N/A"}
                </p>
                <p>
                  <strong>Duration:</strong> {gigDetails.duration || "N/A"}
                </p>
                <p>
                  <strong>Username:</strong> {gigDetails.username || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {gigDetails.email || "N/A"}
                </p>
              </Col>
              <Col
                md={6}
                className="d-flex justify-content-center align-items-center"
              >
                {gigDetails.image ? (
                  <img
                    src={`http://localhost:5000${gigDetails.image}`}
                    alt={gigDetails.title || "Gig Image"}
                    style={{ maxWidth: "300px" }}
                    onError={(e) => console.error("Image load error:", e)}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </Col>
            </Row>
            <div className="d-flex justify-content-center">
              <Button
                variant="success"
                type="submit"
                className="w-25 mb-5 mt-4 fw-bold"
                size="lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ) : (
          <p>No gig details available</p>
        )}
      </Container>
    </>
  );
}

export default Gig;

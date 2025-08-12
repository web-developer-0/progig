import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
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
import Modal from "react-bootstrap/Modal";

function BuyerCart() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);

  const [orderDetails, setOrderDetails] = useState({
    description: "",
    zipFile: null,
  });

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userName");
    const sessionEmail = sessionStorage.getItem("userEmail");

    if (sessionUser) {
      setUser(sessionUser);
      setEmail(sessionEmail);
    } else {
      navigate("/");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  const getCartGigs = async () => {
    try {
      const response = await fetch("http://localhost:5000/getCartGigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, email }), // ✅ Use correct key
      });

      const data = await response.json();

      setGigs(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user && email) {
      getCartGigs();
    }
  }, [user, email]);

  const handleRemoveGig = async (gig) => {
    try {
      const response = await fetch("http://localhost:5000/RemoveCartGigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, email, gig_id: gig._id }), // ✅ Use correct key
      });

      const data = await response.json();

      if (data.message == true) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const orderGig = async (selectedGig) => {
  
    try {
      const formData = new FormData();
      formData.append("username", user);
      formData.append("email", email);
      formData.append("gig_id", selectedGig._id);
      formData.append("gig_title", selectedGig.title);
      formData.append("gig_category", selectedGig.category);
      formData.append("gig_creator", selectedGig.username);
      formData.append("users_description", orderDetails.description);
      formData.append("users_zipFile", orderDetails.zipFile); 
  
      const response = await fetch("http://localhost:5000/OrderCartGigs", {
        method: "POST",
        body: formData, // No headers like JSON!
      });
  
      const data = await response.json();
  
      if (data.message === true) {
        alert("Payment Successed and Gig Ordered Successfully");
        handleRemoveGig(selectedGig);
        navigate("/buyer/orders");
      }
    } catch (err) {
      console.log(err);
    }
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
          <Nav.Link
              as={Link}
              to="/"
              className="nav-link fs-5 mx-3"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/buyer/profile"
              className="nav-link fs-5 mx-3"
            >
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/buyer/cart" className="nav-link fs-5 mx-3">
              Cart
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/buyer/orders"
              className="nav-link fs-5 mx-3"
            >
              Orders
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
              <></>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container className="text-center">
        {gigs.length === 0 ? (
          <h3 className="text-muted my-5">Cart is empty.</h3>
        ) : (
          <Row className="d-flex justify-content-center">
            {gigs.map((gig, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={index}>
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
                      onClick={() => {
                        console.log("Clicked gig:", gig);
                        setSelectedGig({ ...gig });
                        setOrderDetails({
                          description: "",
                          zipFile: null,
                        });
                        
                      }}
                      className="mt-auto"
                    >
                      Place Order
                    </Button>

                    <Button
                      variant="warning"
                      className="mt-2"
                      onClick={() => handleRemoveGig(gig)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal
        show={!!selectedGig}
        onHide={() => setSelectedGig(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Place Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGig && (
            <>
              <h5>{selectedGig.title}</h5>
              <p>by {selectedGig.username}</p>
              <p className="mt-5">
                Here you can add more order details or inputs.
              </p>

              <div className="mt-3">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Describe your requirements..."
                  value={orderDetails.description}
                  onChange={(e) =>
                    setOrderDetails({
                      ...orderDetails,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-4">
                <label htmlFor="zipUpload" className="form-label">
                  Upload ZIP File
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="zipUpload"
                  accept=".zip"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 10 * 1024 * 1024) {
                      alert(
                        "File size exceeds 10MB. Please upload a smaller file."
                      );
                      e.target.value = "";
                      return;
                    }
                    setOrderDetails({ ...orderDetails, zipFile: file });
                  }}
                />
                <small className="text-muted ms-3">
                  Only .zip files are allowed. Maximum size 10MB.
                </small>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedGig(null)}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => orderGig(selectedGig)}>Confirm Order</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BuyerCart;

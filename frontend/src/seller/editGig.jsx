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
  InputGroup,
} from "react-bootstrap";

function editGig() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
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

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    image: null,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.price < 500) {
      alert("Price should be greater than 500 rupees.");
      return;
    }

    const data = new FormData();
    data.append("username", user);
    data.append("email", email);
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("duration", formData.duration);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      const res = await fetch("http://localhost:5000/UpdateGig", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.message === "success") {
        alert("Gig created successfully!");
        navigate("/seller/yourGigs");
      } else {
        alert("Error creating gig");
      }
    } catch (err) {
      console.error("Error:", err);
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
        <h2 className="d-flex justify-content-center">Create a New Gig</h2>

        <Row>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-4 mt-5">
              <Form.Label className="fs-4 mb-2">Gig Title</Form.Label>

              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                size="lg"
              ></Form.Control>

              <Form.Text className="text-muted ms-3">
                ex. I will create a Responsive E-Commerce Website
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4 mt-3">
              <Form.Label className="fs-4 mb-2">Category</Form.Label>

              <Form.Select
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                size="lg"
              >
                <option value="">Choose the Category</option>
                <option value="Designing">Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="App Development">App development</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4 mt-3">
              <Form.Label className="fs-4 mb-2">Duration</Form.Label>

              <Form.Select
                name="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
                size="lg"
              >
                <option value="">Choose Duration</option>
                <option value="2 days">1 Days</option>
                <option value="4 days">2 Days</option>
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="3 Weeks">3 Weeks</option>
                <option value="4 Weeks">4 Weeks</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4 mt-3">
              <Form.Label className="fs-4 mb-2">Price</Form.Label>

              <InputGroup size="lg">
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  placeholder="Enter your price"
                />
              </InputGroup>

              <Form.Text className="text-muted ms-3">
                Mimimum Amount is ₹500
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4 mt-3">
              <Form.Label className="fs-4 mb-2">Description</Form.Label>

              <Form.Control
                as="textarea"
                name="description"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                size="lg"
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4 mt-3">
              <Form.Label className="fs-4 mb-2">Thumbnail Image</Form.Label>

              <Form.Control
                type="file"
                name="image"
                accept=".jpg, .jpeg, .png"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                required
                size="lg"
              ></Form.Control>
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 mb-5 mt-4 fw-bold"
              size="lg"
            >
              Create Gig
            </Button>
          </Form>
        </Row>
      </Container>
    </>
  );
}

export default editGig;

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

function AdminDashboard() {
  const [user, setUser] = useState(null);

  const [gigCount, setGigCount] = useState();
  const [userCount, setUserCount] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userAdmin");
    if (sessionUser) {
      setUser(sessionUser);
      getCount();
    } else {
      navigate("/admin/adminLogin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  const getCount = async() => {
    try {
      const response = await fetch("http://localhost:5000/admin/GetCounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // ✅ Use correct key
      });

      const data = await response.json();
      setGigCount(data.gigCount);
      setUserCount(data.userCount);
      
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
              to="/admin/adminDashboard"
              className="nav-link fs-5 mx-3"
            >
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/usersList" className="nav-link fs-5 mx-3">
              Users
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/gigsList"
              className="nav-link fs-5 mx-3"
            >
              Gigs
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
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container>
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
                <Card.Title style={{ fontSize: "26px" }}>Gigs</Card.Title>
                <Card.Text
                  style={{
                    fontSize: "34px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  {gigCount}
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
                <Card.Title>Draft</Card.Title>
                <Card.Text
                  style={{
                    fontSize: "34px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  ₹ 0
                </Card.Text>
              </Card.Body>
            </Card>
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
                <Card.Title style={{ fontSize: "26px" }}>Users</Card.Title>
                <Card.Text
                  style={{
                    fontSize: "34px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  {userCount}
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
            
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminDashboard;

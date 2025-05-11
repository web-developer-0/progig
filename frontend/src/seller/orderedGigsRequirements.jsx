import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Table,
} from "react-bootstrap";

function OrderedGigsRequirements() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  const [error, setError] = useState(null);
  const [gigDetails, setGigDetails] = useState(null); // Optional, depending on usage
  const [isLoading, setIsLoading] = useState(true);

  const [projectData, setProjectData] = useState({
    description: "",
    zipfile: null,
  });

  const [orderedGigsRequirements, setOrderedGigRequirements] = useState(null);

  var filepath;

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

    const queryParams = new URLSearchParams(location.search);
    const gigId = queryParams.get("val");

    if (gigId) {
      getOrderedGigRequirements(gigId);
    } else {
      setError("No gig_id provided in URL");
      setGigDetails(null);
      setIsLoading(false);
    }
  }, [navigate, location]);

  const getOrderedGigRequirements = async (gigId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/GetOrderedGigRequirements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gig_Id: gigId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch gig details");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No gig data returned");
      }

      const gigData = Array.isArray(data) ? data[0] : data;

      setOrderedGigRequirements(gigData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  if (orderedGigsRequirements != null) {
    filepath =
      "http://localhost:5000/downloadFile?filePath=" +
      orderedGigsRequirements.filePath;
  }

  const handleProjectSubmit = async(e) => {

    e.preventDefault();

    const pData = new FormData();
    pData.append("username", user);
    pData.append("email", email);
    pData.append("gig_title", orderedGigsRequirements.title);
    pData.append("gig_category", orderedGigsRequirements.category);
    pData.append("gig_ordered_by", orderedGigsRequirements.username)
    pData.append("orderedGigId", orderedGigsRequirements._id),
    pData.append("project_description", projectData.description);
    pData.append("zipfile", projectData.zipfile);

    try {
      const response = await fetch(
        "http://localhost:5000/StoreProject",
        {
          method: "POST",
          body: pData,
        }
      );

      const data = await response.json();

      if(data.message == "success")
      {
          alert("Project Submitted Successfully.");
          navigate("/seller/orders");
          window.location.reload();
      } else {
      alert("Failed to submit project.");
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
        {orderedGigsRequirements ? (
          <div
            style={{
              border: "2px solid green",
              padding: "10px",
              fontSize: "22px",
            }}
          >
            <Row>
              <Col md={8}>
                <p>
                  <strong>Gig Title : </strong>
                  {orderedGigsRequirements.gig_title}
                </p>

                <p>
                  <strong>Ordered User : </strong>
                  {orderedGigsRequirements.username}
                </p>

                <p>
                  <strong>User's Gig Description : </strong>
                  {orderedGigsRequirements.users_description}
                </p>

                <p>
                  <strong>Ordered At : </strong>
                  {new Date(
                    orderedGigsRequirements.orderedAt
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Zip File : </strong>
                  <Link
                    onClick={() => {
                      fetch(filepath, {
                        method: "GET",
                      })
                        .then((res) => res.blob())
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "sample.zip"; // Set your desired download filename here
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Click Here
                  </Link>
                </p>
              </Col>
            </Row>
          </div>
        ) : (
          <p>Loading gig requirements...</p>
        )}

        <div
          style={{
            border: "2px solid green",
            padding: "10px",
            fontSize: "22px",
          }}
        >
          <Form onSubmit={handleProjectSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-4 mt-3">
                  <Form.Label className="fs-4 mb-2">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={6}
                    required
                    size="lg"
                    value={projectData.description}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-4 mt-3">
                  <Form.Label className="fs-4 mb-2">Project File</Form.Label>
                  <Form.Control
                    type="file"
                    name="zipfile"
                    accept=".zip"
                    required
                    size="lg"
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        zipfile: e.target.files[0],
                      })
                    }
                  />
                </Form.Group>
                <Button
                  variant="success"
                  type="submit"
                  className="w-100 mt-5 fw-bold"
                  size="lg"
                >
                  Upload a Project
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default OrderedGigsRequirements;

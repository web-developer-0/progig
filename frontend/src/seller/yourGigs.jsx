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
  Table,
} from "react-bootstrap";

function YourGigs() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  const [yourGig, setYourGig] = useState([]);

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

  useEffect(() => {
    if (user && email) {
      getGigs();
    }
  }, [user, email]);

  const getGigs = async () => {
    try {
      const response = await fetch("http://localhost:5000/yourGigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, email }), // ✅ Use correct key
      });

      const data = await response.json();
      setYourGig(data);
      
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
        <h3 className="mb-4">Your Gigs</h3>
        <Table className="table-striped table-bordered table-hover table-responsive">
          <thead>
            <tr className="table-dark">
              <th>S.No</th>
              <th>Gig Title</th>
              <th>Category</th>
              <th>Created Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {yourGig && yourGig.length > 0 ? (
              yourGig.map((gig, index) => (
                <tr key={gig._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={"/seller/youGigs/gigDetails"}> {gig.title} </Link>
                  </td>
                  <td>{gig.category}</td>
                  <td>{new Date(gig.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={{
                        pathname: `/seller/yourGigs/editGig`,
                        search: `?val=${gig._id}`,
                      }}
                    >
                      {" "}
                      Edit{" "}
                    </Link>
                  </td>
                  <td>
                    <a href="">delete</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No gigs found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default YourGigs;

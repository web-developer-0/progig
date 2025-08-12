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
  Table,
} from "react-bootstrap";

function BuyerOrder() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  const [orderedGigsDetails, setOrderedGigsDetails] = useState([]);

  const navigate = useNavigate();

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

  const getOrderedGigs = async () => {
    try {
      const response = await fetch("http://localhost:5000/GetOrderedDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, email }), // ✅ Use correct key
      });

      const data = await response.json();

      if (data) {
        console.log(data);

        setOrderedGigsDetails(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user && email) {
      getOrderedGigs();
    }
  }, [user, email]);

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

      <Container>
        <Table className="table-striped table-bordered table-hover table-responsive">
          <thead>
            <tr className="table-dark">
              <th>S.No</th>
              <th>Gig Title</th>
              <th>Ordered Date</th>
              <th>freelancer Id</th>
            </tr>
          </thead>
          <tbody>
            {orderedGigsDetails && orderedGigsDetails.length > 0 ? (
              orderedGigsDetails.map((gig, index) => (
                <tr key={gig._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {gig.gig_title}
                  </td>
                  <td>{new Date(gig.orderedAt).toLocaleDateString()}</td>
                  <td>{gig.gig_creator}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No Orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default BuyerOrder;

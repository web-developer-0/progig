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
  Table
} from "react-bootstrap";

function Users() {
  const [user, setUser] = useState(null);

  const [usersList, setUsersList] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("userAdmin");
    if (sessionUser) {
      setUser(sessionUser);
      getUsers();
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

  const getUsers = async() => {
    try {
      const response = await fetch("http://localhost:5000/admin/UsersList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // ✅ Use correct key
      });

      const data = await response.json();
      setUsersList(data);
      
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
            <Nav.Link
              as={Link}
              to="/admin/usersList"
              className="nav-link fs-5 mx-3"
            >
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
        <h3 className="mb-4">Users List</h3>
        <Table className="table-striped table-bordered table-hover table-responsive">
          <thead>
            <tr className="table-dark">
              <th>S.No</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Gigs Owned</th>
            </tr>
          </thead>
          <tbody>
            {usersList && usersList.length > 0 ? (
              usersList.map((users, index) => (
                <tr key={users._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {users.name}
                  </td>
                  <td>{users.username}</td>
                  <td>{users.email}</td>
                  <td>{users.gigCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No Users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Users;

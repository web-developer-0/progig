import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/loginAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();

      if (data.message === "UNF") {
        setTimeout( () => setErrorMsg("User Not Found"), 5000);
      } 
      else if (data.message === "true") {
        sessionStorage.setItem("userAdmin", data.userName);
        navigate("/admin/adminDashboard");
      } 
      else if (data.message === "false") {
        setTimeout( () => setErrorMsg("Email or Password is Incorrect"), 5000);
      }
      
    } catch (err) {
      console.log("Error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Login</h2>

        {errorMsg && (
          <Alert variant="danger" className="text-center fw-bold">
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={handleLoginSubmit}>
          <Form.Group controlId="formEmail" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Enter your Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-4">
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="lg"
            />
          </Form.Group>

          <Button
            variant="outline-success"
            type="submit"
            className="w-100 mb-3 fw-bold"
            size="lg"
          >
            Login
          </Button>
        </Form>

      </Card>
    </Container>
  );
}

export default Login;

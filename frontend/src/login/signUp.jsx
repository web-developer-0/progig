import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, email, userName, password };

    try {
      const response = await fetch("http://localhost:5000/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.message === "userName exist") {
        setTimeout( () => setErrorMsg("Username already exists. Please try another username."), 5000);
        setSuccessMsg("");
      }
      else if(data.message === "User exist"){
        setTimeout( () => setErrorMsg("Email already exists. Please try another email."), 5000);
        setSuccessMsg("");
      } 
      else {
        setTimeout( () => setSuccessMsg("Account created successfully!"), 5000) ;
        setErrorMsg("");
        setTimeout(() => navigate("/login"), 5000);
      }
    } catch (err) {
      console.log("Error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSignUpSubmit}>
          <Form.Group controlId="formName" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-4">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group controlId="formUsername" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Create a username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-4">
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="lg"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="outline-dark"
            className="w-100 fw-bold"
            size="lg"
          >
            Sign Up
          </Button>
        </Form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-decoration-none">
            Login
          </Link>
        </p>
      </Card>
    </Container>
  );
}

export default SignUp;

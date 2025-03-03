import { React } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../../App.css";

function AboutPage() {
  return (
    <div class="about">
      <div class="navbar">
        <div class="logo">
          <h1>ProGig</h1>
        </div>

        <nav>
          <input type="checkbox" id="menu-toggle" />
          <label for="menu-toggle" class="menu-btn">
            &#9776
          </label>

          <ul>
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        <div class="btns">
          <Link to="/login">
            <button class="btn-login">Login</button>
          </Link>
          <Link to="/signUp">
            <button class="btn-signup">Sign up</button>
          </Link>
        </div>
      </div>

      <div class="body">
        <h1>About Page</h1>
      </div>
    </div>
  );
}

function About() {
  return AboutPage();
}

export default About;

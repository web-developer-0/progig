import {React, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import "./contact.css";

function ContactPage() {

  const [user, setUser] = useState(null);
  
    useEffect(()=>{
      const sessionUser = sessionStorage.getItem("userName");
      if(sessionUser){
        setUser(sessionUser)
      }
  
    }, [])


  return (
    <div class="contact">
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

        <div className="btns">
                  {user ? (
                    <div className="user-info">
                        <span><p>{user}</p></span>
                    </div>
                  ) : (
                    <>
                      <Link to="/login">
                        <button className="btn-login">Login</button>
                      </Link>
                      <Link to="/signUp">
                        <button className="btn-signup">Sign up</button>
                      </Link>
                    </>
                  )}
                </div>

      </div>

      <div class="contact-container">
        
      <h1>Contact Us</h1>

      <p>
      
        <span class="contact-header">Get in Touch</span>

        <span className="contact-content">
        Have questions or need assistance? We’re here to help! Whether you’re a freelancer looking for
        opportunities or a business seeking top talent, feel free to reach out to us.
        </span>

        <span class="contact-header">How to Reach Us</span>

        <span className="contact-content-pt">
        📍 Address: 14, West Street, Virudhunagar - 626001.<br/>
        📞 Phone: +91 1234567890<br/>
        ✉ Email: manoj@example.com<br/>
        </span>

        <span class="contact-header">Support & Assistance</span>

        <span className="contact-content-pt">
        💬 Live Chat: Available 24/7 for quick support.<br/>
        📩 Help Desk: Submit a ticket, and our team will get back to you.<br/>
        🔗 FAQs: Find answers to common questions in our [FAQ section].<br/>
        </span>

        <span class="contact-header">Follow Us</span>

        <span className="contact-content-pt">
        Stay connected with us on social media for the latest updates:
        🔹 Facebook: [Your Facebook Link]<br/>
        🔹 Twitter/X: [Your Twitter Link]<br/>
        🔹 LinkedIn: [Your LinkedIn Link]<br/>
        🔹 Instagram: [Your Instagram Link]<br/>
        </span>

        <span class="contact-header">Send Us a Message</span>

        <span className="contact-content">Fill out the form below, and we’ll get back to you as soon as possible.</span>

        [(Insert Contact Form Here)]

</p>
        
      </div>
    </div>
  );
}

function Contact() {
  return ContactPage();
}

export default Contact;

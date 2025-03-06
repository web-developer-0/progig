import {React, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import "./about.css";

function AboutPage() {

  const [user, setUser] = useState(null);
  
    useEffect(()=>{
      const sessionUser = sessionStorage.getItem("userName");
      if(sessionUser){
        setUser(sessionUser)
      }
  
    }, [])


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

      <div class="about-container">
        <h1>About Us</h1>

        <p>

            <span className="body-header">Empowering Freelancers, Connecting Businesses</span>

            <br/>

            <span className="body-content">
            Welcome to ProGig - freelancer marketplace, the ultimate platform where talent meets opportunity. 
            Whether you're a skilled freelancer looking for work or a business searching for top-notch professionals, 
            we've got you covered.
            </span>

            <br/>


            <span className="body-header">Who We Are</span>

            <br/>

            <span  className="body-content">
            ProGig is a dynamic marketplace built to bridge the gap between businesses and freelancers. 
            We believe in the power of independent work and the value it brings to both individuals and organizations. 
            Our platform enables seamless collaboration, ensuring businesses get high-quality services while freelancers 
            find rewarding projects.
            </span>

            <br/>

            <span className="body-header">Our Mission</span>

            <br/>

            <span  className="body-content-pt">
            We aim to create a fair, transparent, and efficient marketplace where:
            ✅ Freelancers can showcase their skills and get hired for projects that match their expertise.
            ✅ Businesses can access a diverse pool of talented professionals without the hassle of traditional hiring.
            ✅ Secure payments and smooth communication make the freelancing experience stress-free.
            </span>

            <br/>
            
            <span className="body-header">Why Choose Us?</span>

            <br/>

            <span className="body-content-pt">
            ✔ <u>Diverse Talent Pool:</u> Connect with experts across various fields, from design and development to marketing and content writing.
            <br/>
            ✔ <u>Safe & Secure:</u> Our escrow system ensures that freelancers get paid on time and clients receive high-quality work.
            <br/>
            ✔ <u>User-Friendly Platform:</u> Our easy-to-use interface makes it simple to post projects, manage work, and communicate.
            <br/>
            ✔ <u>Affordable & Transparent:</u> No hidden fees—just a fair and efficient system that benefits everyone.
            </span>

            <br/>
            
            <span className="body-header">Join Us Today!</span>

            <br/>

            <span className="body-content">
            Whether you're a freelancer looking for your next gig or a business seeking the best talent, 
            ProGig is the place to be. Sign up now and be part of the future of freelancing!
            </span>

        </p>

      </div>
    </div>
  );
}

function About() {
  return AboutPage();
}

export default About;

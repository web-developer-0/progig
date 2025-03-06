import {React, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Gig from './Components/gigs/gig';
import About from './Components/pages/about';  
import Contact from './Components/pages/contact';
import Login from './Components/login/login';
import SignUp from './Components/login/signUp';

function Home(){

  const [user, setUser] = useState(null);

  useEffect(()=>{
    const sessionUser = sessionStorage.getItem("userName");
    if(sessionUser){
      setUser(sessionUser)
    }

  }, [])

  return(

  <div className="home">

      <div className="navbar">

        <div className="logo">
          <h1>ProGig</h1>
        </div>

        <nav>
          <input type="checkbox" id="menu-toggle" />
          <label for="menu-toggle" className="menu-btn">&#9776</label>
          <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/about" className="nav-link">About</Link></li>
              <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
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

      <div className="body">

        <h1>Home Page</h1>
        
      </div>

    </div>
  );

}

function App() {
  return (

    <Router>

      <Routes> 

        <Route path="/" element={<Home/>} />

        <Route path="/login" element={<Login/>} />

        <Route path="/signUp" element={<SignUp/>} />

        <Route path="/about" element={<About/>} />

        <Route path="/contact" element={<Contact/>} />

        <Route path="/gig" element={<Gig/>} />

      </Routes>
    
    </Router>


  );
}

export default App;

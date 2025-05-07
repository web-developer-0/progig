import {React, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import About from './Components/pages/about';  
import Contact from './Components/pages/contact';
import Login from './Components/login/login';
import SignUp from './Components/login/signUp';
import CreateGigs from "./Components/seller/createGig";
import Profile from "./Components/seller/profile";


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

        <Route path="/seller/createGig" element={<CreateGigs/>} />

        <Route path="/seller/sellerProfile" element={<Profile/>} />

      </Routes>
    
    </Router>


  );
}

export default App;

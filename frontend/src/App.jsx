import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/home";
import Login from "./login/login";
import SignUp from "./login/signUp";
import About from "./components/about";
import Contact from "./components/contact";

import Gig from "./components/gig"

import BuyerProfile from "./buyer/profile";
import BuyerCart from "./buyer/cart";
import BuyerOrders from "./buyer/order";

import SellerProfile from "./seller/profile";
import CreateGig from "./seller/createGig";
import YourGigs from "./seller/yourGigs";
import EditGig from "./seller/editGig"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signUp" element={<SignUp/>} />

        <Route path="/gig" element={<Gig/>} />

        <Route path="/buyer/profile" element={<BuyerProfile/>} />
        <Route path="/buyer/cart" element={<BuyerCart/>} />
        <Route path="/buyer/orders" element={<BuyerOrders/>} />

        <Route path="/seller/profile" element={<SellerProfile/>} />
        <Route path="/seller/createGig" element={<CreateGig/>} />
        <Route path="/seller/yourGigs" element={<YourGigs/>} />
        <Route path="/seller/yourGigs/editGig" element={<EditGig/>} />
 
      </Routes>
    </Router>
  );
}

export default App;

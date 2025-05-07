import {React, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./signUp.css"; // Import CSS file

function SignUp(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignUpSubmit = async (e) => {

        e.preventDefault();

        const userData = {name, email, userName, password};

        try{
            const response = await fetch("http://localhost:5000/signUp", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(userData)
            });

            const data = await response.json();

        }catch(err){
            console.log("Error")
        }

    };

    return(
        <div className="signup-container">

            <div className="signup-box">

                <h1>Sign Up</h1>

                <form onSubmit={handleSignUpSubmit}>

                    <p className="signup-action"></p>

                    <div className="input-group">

                        <input
                            type = "text"
                            placeholder = "Enter your Name"
                            value = {name}
                            onchange = {(e)=> setName(e.target.value)}
                            required
                            />

                    </div>

                    <div className="input-group">

                        <input
                            type = "email"
                            placeholder = "Enter your Email"
                            value = {email}
                            onchange = {(e)=> setEmail(e.target.value)}
                            required
                            />

                    </div>

                    <div className="input-group">

                        <input
                            type = "text"
                            placeholder = "Create Username"
                            value = {userName}
                            onchange = {(e)=> setUserName(e.target.value)}
                            required
                            />

                    </div>

                    <div className="input-group">

                        <input
                            type = "password"
                            placeholder = "Create password"
                            value = {password}
                            onchange = {(e)=> setPassword(e.target.value)}
                            required
                            />

                    </div>

                    <button type="submit">SignUp</button>

                </form>

                <p>
                    Already have an Account.{" "}
                    <Link to="/login" className="link" >Login</Link>
                </p>

            </div>

        </div>
    );
}

export default SignUp;
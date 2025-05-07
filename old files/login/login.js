import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css"; // Import CSS file

function Login() {

    const [email, setEmail ] = useState("");
    const [password, setPassword ] = useState("");
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {

        e.preventDefault();

        const userData = {email, password};

        try{
            const response = await fetch("http://localhost:5000/loginUser", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if(data.message === "UNF"){
                document.getElementsByClassName("login-action").style.display = "block";
                document.getElementsByClassName("login-action").innerHTML = "<p>User Not Found</p>";
            }
            else if(data.message === "true" ){
                sessionStorage.setItem("userName", data.userName);
        sessionStorage.setItem("userEmail", data.email);
                navigate("/");
            }
            else if (data.message === "false"){
                document.getElementsByClassName("login-action").style.display = "block";
                document.getElementsByClassName("login-action").innerHTML = "<p>Email or Password in Incorrect</p>";
            }


        }catch(err){
            console.log("Error")
        }
    };


  return (
    
    <div className="login-container">

        <div className="login-box">

            <h1>Login</h1>

            <div className="login-action"></div>

            <form onSubmit={handleLoginSubmit}>

                <div className="input-group">
                    
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        required/>
                </div>


                <div className="input-group">
                    
                    <input 
                        type="password" 
                        placeholder="Enter your Password" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        required/>
                </div>
    

                <button type="submit">Login</button>

            </form>

            <p>
                Don't have an Account?{" "}
                <Link to="/signUp" className="link" >SignUp</Link>
            </p>

        </div>

    </div>

  );
}

export default Login;

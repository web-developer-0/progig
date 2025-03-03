import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css"; // Import CSS file

function Login() {

    const [email, setEmail ] = useState("");
    const [password, setPassword ] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        const userData = {email, password};

        try{
            const response = await fetch("http://localhost:5000/loginUser", {
                method: "POST",
                headers: {"content-Type" : "application/json"},
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            console.log(data.message)

        }catch(err){
            console.log("Error")
        }
    };


  return (
    
    <div class="login-container">

        <div className="login=box">

            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <label>Email</label><br></br>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        required/>
                </div>


                <div className="input-group">
                    <label>Password</label><br></br>
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

import './App.css';

function App() {
  return (

    <div class="navbar">

      <div class="logo">
        <h2>ProGig</h2>
      </div>

      <nav>
        <input type="checkbox" id="menu-toggle" />
        <label for="menu-toggle" class="menu-btn">&#9776</label>
        <ul>
            <li>Home</li>
            <li>About</li>
        </ul>
      </nav>

      <div class="btns">
        <button class="btn-login">Login</button>
        <button class="btn-signup">SignUp</button>
      </div>

    </div>

  );
}

export default App;

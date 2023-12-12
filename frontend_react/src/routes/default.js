import axios from "axios";
import "./home.css";
import { Outlet, Link } from "react-router-dom";
const Layout = () => {
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/login">
                <h1 style={{ color: "red" }}>Signin</h1>
              </Link>
            </li>
            <li>
              <Link to="/home">
                <h1 style={{ color: "red" }}>home</h1>
              </Link>
            </li>
          </ul>
        </nav>
  
        <Outlet />
      </>
    );
  };
  

export default Layout;
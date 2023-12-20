import React, { useState } from "react";
import "../components/sign_in_on/signin.css";
import SignInForm from "../components/sign_in_on/signin";
import SignUpForm from "../components/sign_in_on/signup";
import { useEffect } from "react";

/* The commented code is a React functional component that renders a sign-in/sign-up form. */
export default function Signinon() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  useEffect(() => {
    // background: rgb(12, 193, 221);
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-direction: column;
    // font-family: "Montserrat", sans-serif;
    // height: 100vh;
    // margin: -20px 0 50px;
    document.body.style.backgroundColor = "#0cc1dd";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.flexDirection = "column";
    document.body.style.fontFamily = "Montserrat";
    document.body.style.height = "100vh";
    document.body.style.margin = "-10px 0 50px";
    import("../components/sign_in_on/signin.css");
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.display = null;
      document.body.style.justifyContent = null;
      document.body.style.alignItems = null;
      document.body.style.flexDirection = null;
      document.body.style.fontFamily = null;
      document.body.style.height = null;
      document.body.style.margin = null;
    };
  }, []);
  


  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="Signinoncss">
    <div className="App">
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

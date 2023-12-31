import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./routes/home.css";
import Signinon from "./routes/sign_in_on";
import Home from "./routes/home";
import ViewAllForms from "./routes/ViewAllForms";
import React, { useState } from "react";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signinon />} />
        <Route path="/login" element={<Signinon />} />
        <Route path="/home" element={<Home />} />
        <Route path="/view-all-forms" element={<ViewAllForms />} />
        
    </Routes>
    </BrowserRouter >
    );
}

export default App;
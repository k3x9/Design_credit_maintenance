import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Signinon from "./routes/sign_in_on";
import Home from "./routes/home";
import Layout from "./routes/default";
import ViewAllForms from "./routes/ViewAllForms";
import React, { useState } from "react";
import CustomSnackbar from "./components/snack_bar/toast";

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const openSnackbar = () => {
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signinon />} />
        <Route path="/login" element={<Signinon />} />
        <Route path="/home" element={<Home />} />
        <Route path="/view-all-forms" element={<ViewAllForms />} />
        {/* <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/Channel/:id" element={<ChannelDetail />} />
        <Route path="/Search/:searchTerm" element={<SearchFeed />} /> */}
        
    </Routes>
    </BrowserRouter >
    );
}

export default App;
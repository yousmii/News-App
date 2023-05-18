import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes, Link, NavLink } from "react-router-dom";
import styles from "./components/Header.module.scss";
import axios from "axios";

import Homepage from "./pages/Homepage";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import Error403 from "./pages/Error403";
import RegisterForm from "./pages/RegisterPage";
import RSS from "./pages/RSSFeeds";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <main>
        <header>
          <Header />
        </header>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/rss" element={<RSS />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/403" element={<Error403 />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

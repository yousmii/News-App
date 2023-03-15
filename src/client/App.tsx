import React, {useState, useEffect} from "react";
import Header from "./components/Header";
import {BrowserRouter, Route, Routes, Link, NavLink} from "react-router-dom";
import styles from "./components/Header.module.scss"
import axios from 'axios';

import Homepage from "./pages/Homepage";
import Error404 from "./pages/Error404";
import {BsNewspaper} from "react-icons/bs";



function App() {

    return(
        <BrowserRouter>
            <main>
                <header>
                    <Header/>
                </header>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="*" element={<Error404/>} />

                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App;

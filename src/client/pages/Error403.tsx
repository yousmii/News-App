import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import {redirect} from "react-router-dom";

export default function Error403() {

    const navigate = useNavigate()

    useEffect(()=>{
    setTimeout(()=>{
        navigate('/')
    }, 5000)
    })


    


    return (
        <div style={{

                backgroundImage: "url(/403.jpeg)",
                backgroundRepeat: "no-repeat",
                backgroundColor: "black",
                backgroundPosition: "center",
                backgroundSize: "contain",
                width: '100vw',
                height: '100vh',
            }}>
    `
            </div>

    )

}
import {useNavigate} from "react-router-dom";
import React from "react";
import {redirect} from "react-router-dom";

export default function Error403() {

    setTimeout(function () {

        return redirect('/');

    }, 5000)

    


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
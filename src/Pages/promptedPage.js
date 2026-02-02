import TextBox from "../Helper/textBox";
import * as React from 'react';
import {Link} from "@mui/material";
import {useState} from "react";

function PromptedPage() {

    const infoBox =
    `Prompted is a social deduction game where one person receives a prompt that is different than the rest and the others need to guess who that is. It is built using React and uses Socket.IO to communicate with my server to keep players in sync.`;

    const [isMobile] = useState(window.innerWidth <= 768);

    return (
        <React.Fragment>
        <img
            style={{height: isMobile ? "95%" : "45%", width: isMobile ? "95%" : "45%"}}
            src={require('../Assets/PromptedGIF.gif')}
            alt="Prompted game screenshot"
        ></img>
        <TextBox
            content={infoBox}
        />
        <Link
            href="https://eyassino.github.io/Prompted/"
            underline="always"
            color="inherit"
            target="_blank"
        >
            {`Check out the live page here!`}
        </Link>
        </React.Fragment>
    );
}

export default PromptedPage;
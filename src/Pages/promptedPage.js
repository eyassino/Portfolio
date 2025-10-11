import TextBox from "../Helper/textBox";
import * as React from 'react';
import {Link} from "@mui/material";

function PromptedPage() {

    const infoBox =
    `Prompted is a social deduction game where one person receives a prompt that is different than the rest and the others need to guess who that is. It is built using React and uses Socket.IO to communicate with my server to keep players in sync.`;

    return (
        <React.Fragment>
        <img
            style={{height: "50%", width: "50%"}}
            src={require('../Assets/Prompted.png')}
            alt="Prompted game screenshot"
        ></img>
        <TextBox
            content={infoBox}
        />
        <Link
            href="https://eyassino.github.io/Prompted/"
            underline="always"
            color="inherit"
        >
            {`Prompted live page`}
        </Link>
        </React.Fragment>
    );
}

export default PromptedPage;
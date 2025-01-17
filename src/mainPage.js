import './App.css';
import * as React from 'react';
import TypingText from "./typing";
import {useState} from "react";

function MidText() {
    return(
        <div className="information-box">
            <p>
                In this website you will find some personal projects that I worked on, I will be adding more as I finish them.
                Currently there is only the algorithm search project available, you can find it by clicking on the button at the top toolbar.
                <br/><br/>Thanks for checking this page out and please don't hesitate to reach out :)
            </p>
        </div>
    );
}

function MainPage() {
    const [typingIsDone, setTypingIsDone] = useState(false);

    const showInfoBox = () => {
        setTypingIsDone(true);
    };

    return (
        <div className="App">
            <div className="default-padding">
                <TypingText typingDone={showInfoBox}/>
            </div>
            {typingIsDone && (
                <MidText/>
            )}
        </div>
    );
}

export default MainPage;

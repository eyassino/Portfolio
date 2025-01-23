import './App.css';
import * as React from 'react';
import TypingText from "./typing";
import {useState} from "react";
import TextBox from "./textBox";

function MainPage() {

    const [typingIsDone, setTypingIsDone] = useState(false);
    const [aboutBoxState, setAboutBoxState] = useState(false);

    const midText = `In this website you will find some personal projects that I worked on, I will be adding more as I finish them.
                    Currently there is only the algorithm search project available without redirection, you can find it by clicking on the button at the top toolbar.
                    
                    Thanks for checking this page out and please don't hesitate to reach out!`;

    const aboutText = `I'm a graduate with a Bachelor's degree in Computer Science based in New Brunswick Canada, and I like to code.
                              
                              I have experience from my previous positions as a software developer and as a quality assurance analyst.
    
                              I am skilled at:
                              • Java ☕
                              • JavaScript 🌐
                              • SQL 📋
                              • Python 🐍
                              • C ⚙️
                              
                              Some frameworks that I have worked with before:
                              • React ⚛️
                              • Play ▶️
                              • Bootstrap 🥾
                              • Kotlin 📱`;



    const showInfoBox = () => {
        setTypingIsDone(true);
    };

    async function handleAboutClick() {
        setAboutBoxState(!aboutBoxState);
    }

    function AboutSection() {
        return(
            <div
                className={`about-box ${aboutBoxState ? 'clicked' : 'start'}`}
                onClick={handleAboutClick}
            >
                <p style={{whiteSpace: "pre-line"}}>
                    About me
                </p>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="default-padding">
                <TypingText typingDone={showInfoBox}/>
            </div>
            {typingIsDone && (
                <React.Fragment>
                    {!aboutBoxState &&(
                        <TextBox
                            content={midText}
                        />
                    )}
                    {aboutBoxState && (
                        <TextBox
                            content={aboutText}
                            onClick={handleAboutClick}
                        />
                    )}
                    <AboutSection/>
                </React.Fragment>
            )}
        </div>
    );
}

export default MainPage;

import React, { useState, useEffect } from "react";

const TypingText = ({
                      typingDone = () => {}
                    }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing", "deleting", or "final"
  const [isDone, setIsDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true); // Blinking cursor state

  const eraseText = "Hello! My nam";
  const finalText = "Hi. I'm Emil :)";
  const speed = 60;
  const eraseSpeed = 40;
  const pauseTime = 600;
  const cursorBlinkSpeed = 500;


  useEffect(() => {
    if (isDone){
      typingDone();
      return;
    }

    const interval = setInterval(() => {
      if (phase === "typing" && currentIndex < eraseText.length && !isDone) {
        // Typing the eraseText
        setDisplayedText((prev) => prev + eraseText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else if (phase === "deleting" && currentIndex > 0 && !isDone) {
        // Erasing the eraseText
        setDisplayedText((prev) => prev.slice(0, -1));
        setCurrentIndex((prevIndex) => prevIndex - 1);
      } else if (phase === "final" && currentIndex < finalText.length && !isDone) {
        // Typing the finalText
        setDisplayedText((prev) => prev + finalText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);

        // Transition between phases
        if (phase === "typing" && currentIndex === eraseText.length) {
          setTimeout(() => {
            setPhase("deleting");
          }, pauseTime);
        } else if (phase === "deleting" && currentIndex === 0) {
          setTimeout(() => {
            setPhase("final");
            setCurrentIndex(0);
          }, pauseTime);
        } else if (phase === "final" && currentIndex === finalText.length) {
          setIsDone(true);
        }
      }
    }, phase === "deleting" ? eraseSpeed : speed);

    return () => clearInterval(interval);
  }, [currentIndex, phase, isDone, eraseText, finalText, speed, eraseSpeed, pauseTime, typingDone]);

  // Blinking cursor logic
  useEffect(() => {
    if(isDone) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, cursorBlinkSpeed);

      return () => clearInterval(cursorInterval);
    }
  }, [cursorBlinkSpeed, isDone]);

  return(
      <span>
      {displayedText}
      <span style={{visibility: showCursor ? "visible" : "hidden"}}>|</span>
    </span>
  );
};

export default TypingText;

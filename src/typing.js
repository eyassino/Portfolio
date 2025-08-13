import React, {useState, useEffect, useRef} from "react";

const TypingText = ({
                      typingDone = () => {},
                      typingIsDone = false
                    }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing", "deleting", or "final"
  const [showCursor, setShowCursor] = useState(true); // Blinking cursor state
  const [cursorBlink, setCursorBlink] = useState(false); // Blinking cursor state
  const isDone = useRef(false);

  const eraseText = "Hello! My nam";
  const finalText = "Hi. I'm Emil :)";
  const speed = 60;
  const eraseSpeed = 40;
  const pauseTime = 600;
  const cursorBlinkSpeed = 500;

  useEffect(() => {
    if (typingIsDone) {
      setDisplayedText(finalText);
      setCursorBlink(true);
      return;
    }

    const interval = setInterval(() => {
      if (phase === "typing" && currentIndex < eraseText.length && !typingIsDone) {
        // Typing the eraseText
        setDisplayedText((prev) => prev + eraseText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else if (phase === "deleting" && currentIndex > 0 && !typingIsDone) {
        // Erasing the eraseText
        setDisplayedText((prev) => prev.slice(0, -1));
        setCurrentIndex((prevIndex) => prevIndex - 1);
      } else if (phase === "final" && currentIndex < finalText.length && !typingIsDone) {
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
          isDone.current = true;
          setCursorBlink(true);
          typingDone();
        }
      }
    }, phase === "deleting" ? eraseSpeed : speed);

    return () => clearInterval(interval);
  }, [currentIndex, phase, typingIsDone, typingDone]);

  useEffect(() => {
          const cursorInterval = setInterval(() => {
              if(cursorBlink){
                setShowCursor((prev) => !prev);
              }
          }, cursorBlinkSpeed);
      return () => clearInterval(cursorInterval);
  }, [cursorBlinkSpeed, cursorBlink]);

  return(
      <span>
      {displayedText}
      <span style={{visibility: showCursor ? "visible" : "hidden"}}>|</span>
    </span>
  );
};

export default TypingText;

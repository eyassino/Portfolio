import * as React from "react";
import {useEffect, useRef} from "react";

function TextBox({ content, onMouseEnter, onClick, direction }) {
    const scrollRef = useRef(0);
    const prevScroll = useRef(0);
    const boxRef = useRef(null);
    const maxScroll = useRef(0);

    useEffect(() => {
        if (boxRef.current) {
            maxScroll.current = boxRef.current.offsetHeight + 25;
        }

        const handleScroll = (e) => {
            e.preventDefault();
            const delta = -e.deltaY; // Reverse the scrolling to make it feel more natural
            scrollRef.current = Math.max(-maxScroll.current, Math.min(scrollRef.current + delta, 0));
            prevScroll.current = scrollRef.current;
            updateTranslation();
        };

        const handleTouchStart = (e) => {
            prevScroll.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            const deltaY = -(prevScroll.current - e.touches[0].clientY) * 2;
            scrollRef.current = Math.max(-maxScroll.current, Math.min(scrollRef.current + deltaY, 0));
            prevScroll.current = e.touches[0].clientY;
            updateTranslation();
        };

        const updateTranslation = () => {
            if (boxRef.current) {
                boxRef.current.style.transform =
                    direction === "up" ? `translateY(${-scrollRef.current}px)`
                    : direction === "down" ? `translateY(${scrollRef.current}px)` : ``;
            }
        };

        window.addEventListener("wheel", handleScroll);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [direction]);

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.classList.add("fade-in");
        }
    }, []);

    return (
        <div
            ref={boxRef}
            {...(onClick && { onClick })}
            {...(onMouseEnter && { onMouseEnter })}
            className="information-box"
        >
            <p style={{ whiteSpace: "pre-line" }}>{content}</p>
        </div>
    );
}

export default TextBox;
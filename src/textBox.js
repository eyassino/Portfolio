import * as React from "react";
import {useEffect, useState} from "react";

function FadeIn({ children, style }) {
    const [styles, setStyles] = useState({
        transform: 'translateY(5%)',
        opacity: 0,
        transition: 'transform 1s ease-out, opacity 1s ease-out',
        ...style,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setStyles({
                transform: 'translateY(0)',
                opacity: 1,
                transition: 'transform 1s ease-out, opacity 1s ease-out',
                ...style,
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [style]);

    return <div style={styles}>{children}</div>;
}

function TextBox({ content, onMouseEnter, onClick, direction}) {
    const [scroll, setScroll] = useState(0);
    const [startY, setStartY] = useState(0);

    useEffect(() => {
        const handleScroll = (e) => {
            // Prevent the default scroll behavior
            e.preventDefault();

            setScroll((prevScrollY) => {
                const newScrollY = prevScrollY + e.deltaY * 0.5;
                return Math.max(0, Math.min(newScrollY, 120)); // uses percentage, but since the boxes are unequel sizes
            });                                                      // the percent max is 120
        };

        const handleTouchStart = (e) => {
            setStartY(e.touches[0].clientY);
        };

        const handleTouch = (e) => { // mobile scroll
            e.preventDefault();
            const deltaY = startY - e.touches[0].clientY;
            setScroll((prevScrollY) => {
                const newScrollY = prevScrollY + deltaY * 0.5;
                return Math.max(0, Math.min(newScrollY, 105));
            });
        }

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('touchmove', handleTouch);
        window.addEventListener('touchstart', handleTouchStart);

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.addEventListener('touchmove', handleTouch);
            window.addEventListener('touchstart', handleTouchStart);
        }
    }, [startY]);

    return(
        <FadeIn style={{transform: direction === "up" ? `translateY(${scroll}%)` : direction === "down" ? `translateY(-${scroll}%)` : ``}}>
            <div
                {...(onClick && {onClick})}
                {...(onMouseEnter && {onMouseEnter})}
                className="information-box">
                <p style={{ whiteSpace: "pre-line"}}>{content}</p>
            </div>
        </FadeIn>
    )
}

export default TextBox;
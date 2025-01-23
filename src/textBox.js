import * as React from "react";
import {useEffect, useState} from "react";

function FadeIn({ children }) {
    const [styles, setStyles] = useState({
        transform: 'translateY(5%)',
        opacity: 0,
        transition: 'transform 1s ease-out, opacity 1s ease-out',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setStyles({
                transform: 'translateY(0)',
                opacity: 1,
                transition: 'transform 1s ease-out, opacity 1s ease-out',
            });
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return <div style={styles}>{children}</div>;
}

function TextBox({ content, onMouseEnter, onClick}) {
    return(
        <FadeIn>
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
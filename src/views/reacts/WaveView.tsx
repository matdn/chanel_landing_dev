import React, { useCallback } from "react";
import { MainThree } from "../../MainThree";
import { TextureLoader } from "three";

export default function WaveView() {
    const threeRef = useCallback((node: HTMLDivElement) => {
        MainThree.SetDomElementContainer(node);
    }, []);
    const text =
        "A multi-socket tool for translating your digital projects easily and seamlessly";

    const words = text.split(" ").map((word, index) => {
        const wordDelay = 0.15 * index;
        const letters = word.split("").map((char, charIndex) => (
            <span
                key={charIndex}
                className="letter"
                style={{ animationDelay: `${wordDelay + 0.02 * charIndex}s` }}
            >
                {char}
            </span>
        ));

        return (
            <span key={index} style={{ display: "inline-block" }}>
                {letters}
            </span>
        );
    });

    return (
        <div className="LandingWave">
            <div className="three" ref={threeRef}></div>
            <div className="textAnimation">
                {/* <img src="./medias/img/logoChanel.png" alt="" /> */}
                <div>
                    <h1>
                        <span>
                            <span>My translation companion</span>
                        </span>
                    </h1>
                    <p>
                        {words.map((word, index) => (
                            <React.Fragment key={index}>{word} </React.Fragment>
                        ))}
                    </p>
                    <button type="button" className="button">
                        <span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <span className="apparitionSpan">
                            <span>
                                <span className="hoverSpan">Access</span>
                            </span>
                        </span>
                        
                    </button>
                </div>
            </div>
        </div>
    );
}

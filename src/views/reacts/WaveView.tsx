import React, { useCallback, useEffect, useState } from "react";
import { MainThree } from "../../MainThree";
import { ViewsProxy } from "pancake";
import EndTransitionCommand from "../../commands/EndTransitionCommand";

export default function WaveView() {
    const [isClassAdded, setIsClassAdded] = useState(false);
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            for (let i = 0; i < 1; i++) { // Génère 5 cubes à chaque mouvement
                const square = document.createElement("div");
                const size = Math.random() * 0.5 +1; 
                const offsetX = (Math.random() - 0.5) * 8; // Position X aléatoire autour de la souris
                const offsetY = (Math.random() - 0.5) * 8; // Position Y aléatoire autour de la souris
                const opacity = Math.random(); // Opacité aléatoire entre 0 et 1

                square.style.left = `${event.pageX + offsetX}px`;
                square.style.top = `${event.pageY + offsetY}px`;
                square.style.width = `${size}px`;
                square.style.height = `${size}px`;
                square.style.opacity = `${opacity}`;
                square.classList.add("mouse-square");
                document.body.appendChild(square);

                setTimeout(() => {
                    square.remove();
                }, 900); // Durée de vie plus courte
            }
        };
        
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };

        
    }, []);

    const handleClick = () => {
        setIsClassAdded(true); 
        EndTransitionCommand.Start();
    };

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
        setTimeout(()=>{
            
        })
        return (
            <span key={index} style={{ display: "inline-block" }}>
            {letters}
            </span>
        );
    });

    return (
        <div className={`LandingWave  ${isClassAdded ? "transitionBackground" : ""}`}>
            <img src="./medias/img/LogoTransition.svg" className={`transitionLogo ${isClassAdded ? "transitionActiveImg" : ""}`} />
            <div className={`pointTransition  ${isClassAdded ? "transitionActiveCircle" : ""}`} />
            {/* <div className={`three  ${isClassAdded ? "opacityTransition" : ""}`}  ref={threeRef}></div> */}
            <div className="three" ref={threeRef}></div>
            <div className={`textAnimation  ${isClassAdded ? "opacityTransition" : ""}`}>
                    <img src="./medias/img/Logo.svg" alt="" />
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
                        <button type="button" className="button" onClick={handleClick}>
                            <span className="apparitionSpan">
                                <span>
                                    <span className="hoverSpan">Access</span>
                                </span>
                            </span>
                            <span className="linesContainer">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                
            </div>
            <div className={`endTransition  ${isClassAdded ? "activate" : ""}`}></div>
        </div>
    );
}

import { MouseEvent, PropsWithChildren, useState } from 'react';
import './HoverActivateButton.css'; // Import your CSS file for styles

export default function HoverActivateButton(props: PropsWithChildren
    & {
        className: string
        onClick: (e?: MouseEvent<HTMLButtonElement>) => void
        hoverTime?: number
    }) {
    const [hovered, setHovered] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [clickable, setClickable] = useState(false);

    const { children, className, onClick, hoverTime = 1000 } = props

    let transitionTime = hovered ? `${hoverTime / 1000}s` : `${hoverTime / 10000}s`;

    const handleMouseEnter = () => {
        setHovered(true);
        setTimer(setTimeout(() => {
            setClickable(true)
        }, 1000)); // Change 1000 to the desired hover time in milliseconds
    };

    const handleMouseLeave = () => {
        setHovered(false)
        clearTimeout(timer)
        setClickable(false)
    }

    const handleClick = () => {
        if (clickable) {
            onClick()
        }
    };

    return (
        <div className={`${hovered ? ' hovered' : ''}`}>
            <button
                className={`hover-button ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {children}
                <div className="loading-bar"
                    style={{ transition: `width ${transitionTime} linear` }}>
                </div>
            </button>
        </div>
    );
};

import "./Controls.css";

interface ControlsProps {
    handleRestart: () => void;
    handlePause: () => void;
    paused: boolean;
    leftScore: number;
    rightScore: number;
}

export default function Controls({
    handleRestart,
    handlePause,
    paused,
    leftScore,
    rightScore,
}: ControlsProps) {

    return <div className="controls">
        <button
            onClick={handlePause}
            className="controls-button controls-button-pause"
        >
            {paused ? "unpause" : "pause"}
        </button>
        <div className="score">
            {leftScore} : {rightScore}
        </div>
        <button
            onClick={handleRestart}
            className="controls-button controls-button-restart"
        >
            restart
        </button>
    </div >
}

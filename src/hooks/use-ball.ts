import { useState } from "react";
import { BOARD_WIDTH, BALL_SIZE, BOARD_HEIGHT } from "../config";

export default function useBall() {
    const [ball, setball] = useState({
        x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
        y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
        vx: 1,
        vy: 0,
    });

    function resetball() {
        setball(prev => ({
            ...prev,
            x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
            y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
        }));
    }

    return { ball, setball, resetball };
}

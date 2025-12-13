import { useState } from "react";
import { BOARD_WIDTH, BALL_SIZE, BOARD_HEIGHT, BALL_SPEED } from "../config";
import type { Player } from "./use-paddle";
import { checkBallWallXCollision, checkBallWallYCollision } from "../collision-handlers";

export type BallData = {
    x: number,
    y: number,
    vx: number,
    vy: number,
};

export default function useBall() {
    const [ball, setball] = useState<BallData>({
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

    function updateball(delta: number) {
        setball(({ x, y, vx, vy }) => {
            if (checkBallWallXCollision(x)) vx = -vx;
            if (checkBallWallYCollision(y)) vy = -vy;
            x = x + BALL_SPEED * vx * delta;
            y = y + BALL_SPEED * vy * delta;
            return { x, y, vx, vy };
        });
    }

    function bounceball(from: Player) {
        setball(prev => ({
            ...prev,
            x: prev.x + BALL_SPEED * 0.01 * from,
            vx: -prev.vx,
        }));
    }

    return { ball, resetball, updateball, bounceball };
}

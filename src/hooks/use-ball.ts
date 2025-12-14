import { useRef } from "react";
import { BOARD_WIDTH, BALL_SIZE, BOARD_HEIGHT, BALL_SPEED } from "../config";
import { Player } from "./use-paddle";

export type BallData = {
    x: number,
    y: number,
    vx: number,
    vy: number,
};

function randomizeDirection() {
    let angle: number;
    if (Math.random() < 0.5) {
        angle = (-Math.PI / 6) + Math.random() * (Math.PI / 3);
    } else {
        angle = (5 * Math.PI / 6) + Math.random() * (Math.PI / 3);
    }

    return {
        vx: Math.cos(angle) * BALL_SPEED,
        vy: Math.sin(angle) * BALL_SPEED,
    }
}

export default function useBall() {
    const { vx, vy } = randomizeDirection();

    const ballref = useRef<BallData>({
        x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
        y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
        vx,
        vy,
    });

    function resetball(server: Player) {
        ballref.current = {
            x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
            y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
            vx: 0,
            vy: 0,
        }

        setTimeout(() => {
            const { vx, vy } = randomizeDirection();
            let mvx = server * vx;
            if (mvx < 0) {
                mvx *= -1;
            }

            ballref.current.vx = mvx;
            ballref.current.vy = vy;
        }, 1000);
    }

    function updateball(delta: number) {
        ballref.current.x += ballref.current.vx * delta;
        ballref.current.y += ballref.current.vy * delta;
    }

    function xbounceball() {
        ballref.current.vx = -ballref.current.vx;
        ballref.current.x += 0.01 * ballref.current.vx;
    }

    function ybounceball() {
        ballref.current.vy = -ballref.current.vy;
    }

    return { ballref, resetball, updateball, xbounceball, ybounceball };
}

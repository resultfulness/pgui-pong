import { useRef } from "react";
import { BOARD_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED } from "../config";

export const Player = {
    LEFT: 1,
    RIGHT: -1,
} as const;

export type Player = (typeof Player)[keyof typeof Player];

export default function usePaddle() {
    const posref = useRef(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2)
    const scoreref = useRef(0);

    function limitpos(pos: number): number {
        if (pos <= 0) {
            pos = 0;
        } else if (pos >= BOARD_HEIGHT - PADDLE_HEIGHT) {
            pos = BOARD_HEIGHT - PADDLE_HEIGHT;
        }
        return pos;
    }

    function updatepos(cb: (y: number) => number) {
        posref.current = limitpos(cb(posref.current));
    }

    function move(dir: "up" | "down", delta: number) {
        updatepos(y => y + PADDLE_SPEED * delta * (dir === "up" ? -1 : 1));
    }

    function onScored() {
        scoreref.current += 1;
    }

    return { posref, scoreref, move, onScored };
}

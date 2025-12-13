import { useState } from "react";
import { BOARD_HEIGHT, PADDLE_HEIGHT } from "../config";

export const Player = {
    LEFT: 1,
    RIGHT: -1,
} as const;

export type Player = (typeof Player)[keyof typeof Player];

export default function usePaddle(player: Player) {
    const [pos, setpos] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    const [score, setscore] = useState(0);

    function limitpos(pos: number): number {
        if (pos <= 0) {
            pos = 0;
        } else if (pos >= BOARD_HEIGHT - PADDLE_HEIGHT) {
            pos = BOARD_HEIGHT - PADDLE_HEIGHT;
        }
        return pos;
    }

    function updatepos(cb: (y: number) => number) {
        setpos(prev => limitpos(cb(prev)));
    }

    return { pos, updatepos, score, setscore };
}

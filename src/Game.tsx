import { useEffect, useRef, useState } from "react";
import Ball from "./Ball";
import Board from "./Board";
import Paddle from "./Paddle";
import "./Game.css";
import useKeys from "./keys";
import {
    BALL_SIZE,
    BALL_SPEED,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    GAME_TIME,
    PADDLE_HEIGHT,
    PADDLE_SPEED,
} from "./config";
import Timer from "./Timer";

export default function Game() {
    const [time, settime] = useState(GAME_TIME);
    const [pause, setpause] = useState(true);

    const [ball, setball] = useState({
        x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
        y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
        vx: 1,
        vy: 1,
    })

    const [leftpos, setleftpos] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    const [rightpos, setrightpos] = useState(leftpos);

    function limitpaddle(pos: number): number {
        if (pos <= 0) {
            pos = 0;
        } else if (pos >= BOARD_HEIGHT - PADDLE_HEIGHT) {
            pos = BOARD_HEIGHT - PADDLE_HEIGHT;
        }
        return pos;
    }

    function updateleftpos(cb: (pos: number) => number) {
        setleftpos(prev => limitpaddle(cb(prev)));
    }
    function updaterightpos(cb: (pos: number) => number) {
        setrightpos(prev => limitpaddle(cb(prev)));
    }

    const keys = useKeys();

    function update(time: number) {
        if (pause) {
            previousTime.current = undefined;
            return;
        }
        let delta = 0;
        if (previousTime.current !== undefined) {
            delta = (time - previousTime.current) * 0.001;
        }

        if (keys.KeyQ) updateleftpos(pos => pos - PADDLE_SPEED * delta);
        if (keys.KeyA) updateleftpos(pos => pos + PADDLE_SPEED * delta);
        if (keys.KeyP) updaterightpos(pos => pos - PADDLE_SPEED * delta);
        if (keys.KeyL) updaterightpos(pos => pos + PADDLE_SPEED * delta);

        setball(({ x, y, vx, vy }) => {
            if (x <= 0 || x >= BOARD_WIDTH - BALL_SIZE) vx = -vx;
            if (y <= 0 || y >= BOARD_HEIGHT - BALL_SIZE) vy = -vy;
            x = x + BALL_SPEED * vx * delta;
            y = y + BALL_SPEED * vy * delta;
            return { x, y, vx, vy };
        })

        previousTime.current = time;
        animationRequestID.current = requestAnimationFrame(update);
    }

    const animationRequestID = useRef(0);
    const previousTime = useRef<number | undefined>(undefined);

    useEffect(() => {
        animationRequestID.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRequestID.current);
    }, [pause]);

    return <div className="pong-game">
        <Timer time={time} settime={settime} paused={pause} />
        <Board>
            <Ball x={ball.x} y={ball.y} />
            <Paddle pos={leftpos} side="left" />
            <Paddle pos={rightpos} side="right" />
        </Board>
        <button onClick={() => window.location.reload()}>restart</button>
        <button onClick={() => setpause(p => !p)}>
            {pause ? "unpause" : "pause"}
        </button>
    </div>;
}

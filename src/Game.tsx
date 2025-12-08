import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Ball from "./components/game_objects/Ball";
import Paddle from "./components/game_objects/Paddle";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import useKeys from "./hooks/use-keys";
import {
    BALL_SIZE,
    BALL_SPEED,
    BOARD_GOAL_SIZE,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    GAME_TIME,
    PADDLE_GOAL_OFFSET,
    PADDLE_HEIGHT,
    PADDLE_SPEED,
    PADDLE_WIDTH,
} from "./config";

export default function Game() {
    const [time, settime] = useState(GAME_TIME);
    const [pause, setpause] = useState(true);
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);

    const [ball, setball] = useState({
        x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
        y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
        vx: 1,
        vy: 0,
    })

    const [left, setleft] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    const [right, setright] = useState(left);

    function limitpaddle(pos: number): number {
        if (pos <= 0) {
            pos = 0;
        } else if (pos >= BOARD_HEIGHT - PADDLE_HEIGHT) {
            pos = BOARD_HEIGHT - PADDLE_HEIGHT;
        }
        return pos;
    }

    function updateleft(cb: (y: number) => number) {
        setleft(prev => limitpaddle(cb(prev)));
    }
    function updateright(cb: (y: number) => number) {
        setright(prev => limitpaddle(cb(prev)));
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

        if (keys.KeyQ) updateleft(y => y - PADDLE_SPEED * delta);
        if (keys.KeyA) updateleft(y => y + PADDLE_SPEED * delta);
        if (keys.KeyP) updateright(y => y - PADDLE_SPEED * delta);
        if (keys.KeyL) updateright(y => y + PADDLE_SPEED * delta);

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

    useEffect(() => {
        const { x, y } = ball;
        if (y >= right
            && y <= right + PADDLE_HEIGHT
            && x >= (BOARD_WIDTH - PADDLE_GOAL_OFFSET - PADDLE_WIDTH - BALL_SIZE)
        ) {
            setball(prev => ({
                ...prev,
                x: prev.x - BALL_SPEED * 0.01,
                vx: -prev.vx,
            }));
        }
    }, [ball, right]);

    useEffect(() => {
        const { x, y } = ball;
        if (y >= left
            && y <= left + PADDLE_HEIGHT
            && x <= PADDLE_GOAL_OFFSET + PADDLE_WIDTH
        ) {
            setball(prev => ({
                ...prev,
                x: prev.x + BALL_SPEED * 0.01,
                vx: -prev.vx,
            }));
        }
    }, [ball, left]);

    useEffect(() => {
        const { x, y } = ball;
        if (y >= (BOARD_HEIGHT - BOARD_GOAL_SIZE) / 2
            && y <= (BOARD_HEIGHT - BOARD_GOAL_SIZE) / 2 + BOARD_GOAL_SIZE) {
            if (x >= BOARD_WIDTH - BALL_SIZE) {
                setLeftScore(s => s + 1);
                setball(prev => ({
                    ...prev,
                    x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
                    y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
                }));
            } else if (x <= 0) {
                setRightScore(s => s + 1);
                setball(prev => ({
                    ...prev,
                    x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
                    y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
                }));
            }
        }
    }, [ball]);

    const animationRequestID = useRef(0);
    const previousTime = useRef<number | undefined>(undefined);

    useEffect(() => {
        animationRequestID.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRequestID.current);
    }, [pause]);

    return <div className="game">
        <Timer time={time} settime={settime} paused={pause} />
        <Board>
            <Ball x={ball.x} y={ball.y} />
            <Paddle pos={left} side="left" />
            <Paddle pos={right} side="right" />
        </Board>
        <Controls
            handlePause={() => setpause(prev => !prev)}
            handleRestart={() => window.location.reload()}
            paused={pause}
            leftScore={leftScore}
            rightScore={rightScore}
        />
    </div>;
}

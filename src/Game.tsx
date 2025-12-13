import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import Ball from "./components/game_objects/Ball";
import Paddle from "./components/game_objects/Paddle";
import useBall from "./hooks/use-ball";
import usePaddle, { Player } from "./hooks/use-paddle";
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

    const { ball, setball, resetball } = useBall();

    const {
        pos: left,
        updatepos: updateleft,
        score: leftScore,
        setscore: setLeftScore,
    } = usePaddle(Player.LEFT);
    const {
        pos: right,
        updatepos: updateright,
        score: rightScore,
        setscore: setRightScore,
    } = usePaddle(Player.RIGHT);

    const keys = useKeys(["KeyQ", "KeyA", "KeyP", "KeyL", "Space"]);

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
        });

        previousTime.current = time;
        animationRequestID.current = requestAnimationFrame(update);
    }

    function handlePaddleBallCollision(player: Player) {
        const { x, y } = ball;
        if (
            player === Player.RIGHT
                ? (y >= right
                    && y <= right + PADDLE_HEIGHT
                    && x >= (BOARD_WIDTH - PADDLE_GOAL_OFFSET - PADDLE_WIDTH - BALL_SIZE))
                : (y >= left
                    && y <= left + PADDLE_HEIGHT
                    && x <= PADDLE_GOAL_OFFSET + PADDLE_WIDTH)
        ) {
            setball(prev => ({
                ...prev,
                x: prev.x + BALL_SPEED * 0.01 * player,
                vx: -prev.vx,
            }));
        }
    }
    useEffect(() => handlePaddleBallCollision(Player.RIGHT), [ball, right]);
    useEffect(() => handlePaddleBallCollision(Player.LEFT), [ball, left]);

    function handleBallScore() {
        const { x, y } = ball;
        if (y >= (BOARD_HEIGHT - BOARD_GOAL_SIZE) / 2
            && y <= (BOARD_HEIGHT - BOARD_GOAL_SIZE) / 2 + BOARD_GOAL_SIZE) {
            if (x >= BOARD_WIDTH - BALL_SIZE) {
                setLeftScore(s => s + 1);
                resetball();
            } else if (x <= 0) {
                setRightScore(s => s + 1);
            }
        }
    }
    useEffect(handleBallScore, [ball]);

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

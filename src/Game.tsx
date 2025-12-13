import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import Ball from "./components/game_objects/Ball";
import Paddle from "./components/game_objects/Paddle";
import useBall from "./hooks/use-ball";
import usePaddle, { Player } from "./hooks/use-paddle";
import useKeys from "./hooks/use-keys";
import { GAME_TIME } from "./config";
import {
    checkBallGoalColision,
    checkBallPaddleCollision
} from "./collision-handlers";

export default function Game() {
    const [time, settime] = useState(GAME_TIME);
    const [pause, setpause] = useState(true);

    const { ball, resetball, updateball, bounceball } = useBall();
    const left = usePaddle();
    const right = usePaddle();

    useEffect(() => {
        if (checkBallPaddleCollision(Player.RIGHT, right.pos, ball)) {
            bounceball(Player.RIGHT);
        }
    }, [ball, right]);

    useEffect(() => {
        if (checkBallPaddleCollision(Player.LEFT, left.pos, ball)) {
            bounceball(Player.LEFT);
        }
    }, [ball, left]);

    useEffect(() => {
        const scored = checkBallGoalColision(ball);
        if (scored) {
            if (scored === Player.LEFT) {
                left.onScored();
            } else {
                right.onScored();
            }
            resetball();
        }
    }, [ball]);

    const keys = useKeys(["KeyQ", "KeyA", "KeyP", "KeyL"] as const);

    function update(time: number) {
        if (pause) {
            previousTime.current = undefined;
            return;
        }
        let delta = 0;
        if (previousTime.current !== undefined) {
            delta = (time - previousTime.current) * 0.001;
        }

        if (keys.KeyQ) left.move("up", delta);
        if (keys.KeyA) left.move("down", delta);
        if (keys.KeyP) right.move("up", delta);
        if (keys.KeyL) right.move("down", delta);

        updateball(delta);

        previousTime.current = time;
        animationRequestID.current = requestAnimationFrame(update);
    }

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
            <Paddle pos={left.pos} side="left" />
            <Paddle pos={right.pos} side="right" />
        </Board>
        <Controls
            handlePause={() => setpause(prev => !prev)}
            handleRestart={() => window.location.reload()}
            paused={pause}
            leftScore={left.score}
            rightScore={right.score}
        />
    </div>;
}

import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import VictoryScreen from "./components/VictoryScreen";
import Ball from "./components/game_objects/Ball";
import Paddle from "./components/game_objects/Paddle";
import useBall from "./hooks/use-ball";
import usePaddle, { Player } from "./hooks/use-paddle";
import useKeys from "./hooks/use-keys";
import { GAME_SCORE_TO_WIN, GAME_TIME } from "./config";
import {
    checkBallGoalColision,
    checkBallPaddleCollision,
    checkBallWallXCollision,
    checkBallWallYCollision
} from "./collision-handlers";

export default function Game() {
    const [time, settime] = useState(GAME_TIME);
    const [winner, setwinner] = useState<Player | null>(null);
    const pauseref = useRef(true);

    const { ballref, resetball, updateball, xbounceball, ybounceball } = useBall();
    const left = usePaddle();
    const right = usePaddle();

    const [, rerender] = useState(0);

    const keys = useKeys(["KeyQ", "KeyA", "KeyP", "KeyL"] as const);

    const previousTimeRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        let animationId: number;

        function update(time: number) {
            if (pauseref.current) {
                previousTimeRef.current = undefined;
                animationId = requestAnimationFrame(update);
                return;
            }

            let delta = 0;
            if (previousTimeRef.current !== undefined) {
                delta = (time - previousTimeRef.current) * 0.001;
            }

            if (keys.current.KeyQ) left.move("up", delta);
            if (keys.current.KeyA) left.move("down", delta);
            if (keys.current.KeyP) right.move("up", delta);
            if (keys.current.KeyL) right.move("down", delta);

            updateball(delta);

            const scored = checkBallGoalColision(ballref.current);
            if (scored) {
                if (scored === Player.LEFT) {
                    left.onScored();
                } else {
                    right.onScored();
                }
                resetball(scored);
            }

            if (checkBallWallXCollision(ballref.current.x)) {
                xbounceball();
            }

            if (checkBallWallYCollision(ballref.current.y)) {
                ybounceball();
            }

            if (
                checkBallPaddleCollision(
                    Player.RIGHT,
                    right.posref.current,
                    ballref.current,
                )
            ) {
                xbounceball();
            }

            if (
                checkBallPaddleCollision(
                    Player.LEFT,
                    left.posref.current,
                    ballref.current,
                )
            ) {
                xbounceball();
            }

            previousTimeRef.current = time;

            rerender(r => r + 1);

            animationId = requestAnimationFrame(update);
        }

        animationId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationId);
    }, []);

    let togglePause = () => {
        if (time <= 0 || winner !== null) return;
        pauseref.current = !pauseref.current;
        rerender(r => r + 1);
    }

    useEffect(() => {
        if (time <= 0) {
            pauseref.current = true;
            rerender(r => r + 1);
        }
        if (left.scoreref.current >= GAME_SCORE_TO_WIN) {
            pauseref.current = true;
            rerender(r => r + 1);
            setwinner(Player.LEFT);
        }
        if (right.scoreref.current >= GAME_SCORE_TO_WIN) {
            pauseref.current = true;
            rerender(r => r + 1);
            setwinner(Player.RIGHT);
        }
    }, [time]);

    return <div className="game">
        <Timer time={time} settime={settime} paused={pauseref.current} />
        <Board>
            <Ball x={ballref.current.x} y={ballref.current.y} />
            <Paddle pos={left.posref.current} side="left" />
            <Paddle pos={right.posref.current} side="right" />
            {winner && <VictoryScreen player={winner} />}
        </Board>
        <Controls
            handlePause={() => togglePause()}
            handleRestart={() => window.location.reload()}
            paused={pauseref.current}
            leftScore={left.scoreref.current}
            rightScore={right.scoreref.current}
        />
    </div>;
}

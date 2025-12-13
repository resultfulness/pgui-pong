import { PADDLE_HEIGHT, PADDLE_GOAL_OFFSET, PADDLE_WIDTH, BOARD_WIDTH, BALL_SIZE, BALL_SPEED, BOARD_HEIGHT, BOARD_GOAL_SIZE } from "./config";
import type { BallData } from "./hooks/use-ball";
import { Player } from "./hooks/use-paddle";

export function checkBallPaddleCollision(
    player: Player,
    paddlePos: number,
    ball: BallData,
): boolean {
    const { x, y } = ball;

    const ballYWithinPaddle =
        y >= paddlePos && y <= paddlePos + PADDLE_HEIGHT;
    const ballXBehindLeftPaddle = x <= PADDLE_GOAL_OFFSET + PADDLE_WIDTH;
    const ballXBehindRightPaddle =
        x >= (BOARD_WIDTH - PADDLE_GOAL_OFFSET - PADDLE_WIDTH - BALL_SIZE);

    return ballYWithinPaddle && (player === Player.LEFT
            ? ballXBehindLeftPaddle
            : ballXBehindRightPaddle);
}

export function checkBallGoalColision(ball: BallData): Player | null {
    const { x, y } = ball;
    if (y >= (BOARD_HEIGHT - BOARD_GOAL_SIZE) / 2
        && y <= (BOARD_HEIGHT - BOARD_GOAL_SIZE) / 2 + BOARD_GOAL_SIZE) {
        if (x >= BOARD_WIDTH - BALL_SIZE) {
            return Player.LEFT;
        } else if (x <= 0) {
            return Player.RIGHT;
        }
    }
    return null;
}

export function checkBallWallXCollision(ballx: number): boolean {
    return ballx <= 0 || ballx >= BOARD_WIDTH - BALL_SIZE;
}

export function checkBallWallYCollision(bally: number): boolean {
    return bally <= 0 || bally >= BOARD_HEIGHT - BALL_SIZE;
}

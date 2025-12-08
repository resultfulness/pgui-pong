import "./Paddle.css";
import { PADDLE_GOAL_OFFSET, PADDLE_HEIGHT, PADDLE_WIDTH } from "../../config";

interface PaddleProps {
    pos: number;
    side: "left" | "right";
}

export default function Paddle({ pos, side }: PaddleProps) {
    return <div className={`paddle`} style={{
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        top: pos,
        [side]: PADDLE_GOAL_OFFSET,
    }}></div>;
}

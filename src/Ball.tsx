import { BALL_SIZE } from "./config";

interface BallProps {
    x: number;
    y: number;
}

export default function Ball({ x, y }: BallProps) {
    return <div className="ball" style={{
        width: BALL_SIZE,
        left: x,
        top: y,
    }}></div>;
}


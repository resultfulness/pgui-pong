import "./Board.css";
import type { ReactNode } from "react";
import { BOARD_GOAL_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from "../config";

export default function Board({ children }: { children: ReactNode }) {
    return <div
        className="board"
        style={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            gridTemplateRows: `auto ${BOARD_GOAL_SIZE}px auto`,
        }}
    >
        <div className="board-cell board-divider"></div>
        <div className="board-cell board-cell-l"></div>
        <div className="board-cell board-cell-r"></div>
        <div className="board-cell board-cell-goal-l"></div>
        <div className="board-cell board-cell-goal-r"></div>
        <div className="board-cell board-cell-l"></div>
        <div className="board-cell board-cell-r"></div>
        {children}
    </div>;
}

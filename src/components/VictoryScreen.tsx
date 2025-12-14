import "./VictoryScreen.css";
import { Player } from "../hooks/use-paddle";

export default function VictoryScreen({ player }: { player: Player }) {
    return <div className="victory-screen">
        {player === Player.LEFT ? "left" : "right"} player wins!
    </div>;
}

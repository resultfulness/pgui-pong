import { useEffect } from "react";

interface TimerProps {
    time: number;
    settime: React.Dispatch<React.SetStateAction<number>>;
    paused: boolean;
}

export default function Timer({ time, settime, paused }: TimerProps) {
    useEffect(() => {
        if (paused) return;

        const countdown = setInterval(() => {
            settime(t => t - 1);
        }, 1000)

        return () => clearInterval(countdown);
    }, [paused]);

    function pad(num: number): string {
        if (num < 10) {
            return "0" + num;
        }
        return "" + num;
    }

    function formatTime(seconds: number): string {
        const minutePart = Math.floor(seconds / 60);
        const secondPart = seconds % 60;
        return `${minutePart}:${pad(secondPart)}`;
    }

    return <div className="timer">
        {formatTime(time)}
    </div>
}

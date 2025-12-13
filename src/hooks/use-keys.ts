import { useEffect, useRef } from "react";

export default function useKeys<T extends readonly string[]>(
    keys: T
): React.RefObject<Record<T[number], boolean>> {
    const keysRef = useRef({} as Record<T[number], boolean>);

    function updatekeys(ev: KeyboardEvent) {
        const k = ev.code;
        if (keys.includes(k)) {
            ev.preventDefault();
            keysRef.current[k as T[number]] = ev.type === "keydown";
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', updatekeys);
        document.addEventListener('keyup', updatekeys);

        return () => {
            document.removeEventListener('keydown', updatekeys);
            document.removeEventListener('keyup', updatekeys);
        }
    }, []);

    return keysRef;
}

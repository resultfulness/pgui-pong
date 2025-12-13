import { useEffect, useState } from "react";

export default function useKeys<T extends readonly string[]>(
    keys: T
): Record<T[number], boolean> {
    const [keysMap, setKeysMap] = useState({} as Record<T[number], boolean>);

    function updatekeys(ev: KeyboardEvent) {
        const k = ev.code;
        if (keys.includes(k)) {
            ev.preventDefault();
            setKeysMap(prev => {
                const final = prev;
                final[k as T[number]] = ev.type === "keydown";
                return final;
            });
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

    return keysMap;
}

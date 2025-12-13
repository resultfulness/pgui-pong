import { useEffect, useState } from "react";

export default function useKeys(keys: string[]) {
    const [keysMap, setKeysMap] = useState<Record<string, boolean>>({});
    function updatekeys(ev: KeyboardEvent) {
        const k = ev.code;
        if (keys.includes(k)) {
            ev.preventDefault();
            setKeysMap(prev => {
                const final = prev;
                final[k] = ev.type === "keydown";
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

    return keysMap
}

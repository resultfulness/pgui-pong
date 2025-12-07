import { useEffect, useState } from "react";

export default function useKeys() {
    const [keys, setkeys] = useState<Record<string, boolean>>({});
    function updatekeys(ev: KeyboardEvent) {
        const k = ev.code;
        if (/^Key[QAPL]/.test(k)) {
            ev.preventDefault();
            setkeys(prev => {
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

    return keys
}

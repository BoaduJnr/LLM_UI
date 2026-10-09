// Small localStorage wrapper; storage can be unavailable (private mode, quota), so never throw

const PREFIX = "llm-ui:";

export function load(key, fallback) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function save(key, value) {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Could not persist "${key}":`, error);
        return false;
    }
}

export function remove(key) {
    try {
        localStorage.removeItem(PREFIX + key);
    } catch {
        // ignore
    }
}

// Thin wrappers around the Puter.js AI APIs (loaded globally from js.puter.com)

function getPuter() {
    if (!globalThis.puter?.ai) {
        throw new Error("Puter.js failed to load. Check your connection and reload the page.");
    }
    return globalThis.puter;
}

// Streams a chat completion for the full conversation (array of {role, content})
export async function streamChat(messages, model) {
    return getPuter().ai.chat(messages, { model, stream: true });
}

export async function generateSpeech(text) {
    return getPuter().ai.txt2speech(text);
}

// Uses the given image model when provided, otherwise Puter's default image model
export async function generateImage(prompt, model) {
    const options = model ? { model } : {};
    return getPuter().ai.txt2img(prompt, options);
}

export async function extractText(image) {
    return getPuter().ai.img2txt(image);
}

// Puter rejects with a few different shapes; normalise them to a readable string
export function errorMessage(error) {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    if (typeof error.error === "string") return error.error;
    if (error.error?.message) return error.error.message;
    if (error.message) return error.message;
    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
}

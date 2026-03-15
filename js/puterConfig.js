const Action = {
    CHAT: "chat",
    GENERATE_IMAGE: "generate-image",
    ANALYSE_IMAGE: "analyse-image",
    TRANSCRIBE_AUDIO: "transcribe-audio",
    ANALYSE_FILE: "analyse-file",
    TEXT2SPEECH: "text2specch",
};



export async function askQuestion(prompt, model) {
    let dataStream =
        await continueConversation(prompt, model)
    // await puter.ai.chat(prompt, {
    //     model,
    //     // stream: true
    // });

    return dataStream
}


async function continueConversation(userMessage, model) {
    // Get response from LLM
    const response = await puter.ai.chat(conversationHistory, {
        model,
        stream: true
    });

    return response
}



export async function generateSpeech(userSpeech) {
    const audio = await puter.ai.txt2speech(userSpeech)
    return audio
}


export async function generateImage(imageDesc){
   const image = await puter.ai.txt2img(imageDesc, true)
    return image
}


export async function extractText(image){
    text = await puter.ai.img2txt(image)
    return
}
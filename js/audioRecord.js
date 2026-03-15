// Audio recording variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Get DOM elements
const recordBtn = document.getElementById('record-btn');
const recordingStatus = document.getElementById('recording-status');

// Initialize audio recording
async function initializeAudioRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            handleAudioRecording(audioBlob);
            audioChunks = [];
        };
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        recordingStatus.textContent = 'Microphone access denied';
    }
}

// Handle record button click
recordBtn.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

// Start recording
function startRecording() {
    if (!mediaRecorder) {
        initializeAudioRecording().then(() => {
            if (mediaRecorder) {
                mediaRecorder.start();
                isRecording = true;
                recordBtn.textContent = '⏹ Stop Recording';
                recordingStatus.textContent = 'Recording...';
            }
        });
    } else {
        mediaRecorder.start();
        isRecording = true;
        recordBtn.textContent = '⏹ Stop Recording';
        recordingStatus.textContent = 'Recording...';
    }
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.textContent = '🎙 Record';
        recordingStatus.textContent = 'Processing audio...';
    }
}

// Handle the recorded audio blob
function handleAudioRecording(audioBlob) {
    // Option 1: Convert to base64 for API submission
    const reader = new FileReader();
    reader.onload = function() {
        const base64Audio = reader.result.split(',')[1];
        // Send to your LLM API that supports audio input
        submitAudioToLLM(base64Audio);
    };
    reader.readAsDataURL(audioBlob);
    
    // Option 2: Create download link for testing
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Optional: Add playback controls
    addAudioPlayback(audioUrl);
    
    recordingStatus.textContent = 'Audio recorded successfully';
}

// Add audio playback for testing
function addAudioPlayback(audioUrl) {
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = audioUrl;
    audioElement.className = 'recorded-audio';
    
    // Add to response display or create a separate audio section
    const responseDisplay = document.getElementById('response-display');
    responseDisplay.appendChild(audioElement);
}

// Submit audio to LLM (placeholder - implement based on your API)
function submitAudioToLLM(base64Audio) {
    // This depends on your LLM platform
    // Some platforms accept audio directly, others need transcription first
    
    // Example for transcription-first approach:
    transcribeAudio(base64Audio).then(text => {
        document.getElementById('prompt-input').value = text;
        // Optionally auto-submit
        document.getElementById('submit-btn').click();
    });
}

// Transcribe audio (example using Web Speech API)
function transcribeAudio(audioBlob) {
    return new Promise((resolve, reject) => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };
        
        recognition.onerror = (event) => {
            reject(event.error);
        };
        
        // Note: Speech Recognition API works with live audio, not recorded blobs
        // For recorded audio transcription, you'd need a service like:
        // - OpenAI Whisper API
        // - Google Speech-to-Text
        // - Azure Speech Services
        
        recognition.start();
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Request microphone permission on page load (optional)
    // initializeAudioRecording();
});
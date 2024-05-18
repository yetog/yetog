// Retrieve elements for text area, voice list, buttons
const textarea = document.getElementById("textarea");
const voiceList = document.getElementById("voiceList");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const downloadLink = document.createElement("a"); // For potential future download link

// Access SpeechSynthesis API and track speaking status
let synth = speechSynthesis;
let isSpeaking = true; // Flag to track if speech is currently in progress

// Populate voice list with available voices
voices();

function voices() {
  // Get available voices and create options for the select element
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

// Update voices if available voices change
synth.addEventListener("voiceschanged", voices);

// Function to convert text to speech
function textToSpeech(text) {
  // Create utterance with selected voice and text
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}

// Function to download speech as MP3
function downloadSpeech(text) {
  // Create Blob representing audio data and set filename
  const blob = new Blob([text], { type: "audio/mpeg" });
  const fileName = "speech.mp3";

  // Use FileSaver.js if available, otherwise provide an alert
  if (saveAs) {
    saveAs(blob, fileName);
  } else {
    alert("FileSaver.js library is not loaded. Download functionality might be limited.");

    // Consider providing a fallback mechanism here if needed
  }
}

// Handle convert button click
convertBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking) {
      textToSpeech(textarea.value); // Trigger text-to-speech
      convertBtn.disabled = true; // Disable convert button during speech
      downloadBtn.disabled = false; // Enable download button
    }
  }
});

// Handle download button click
downloadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  downloadSpeech(textarea.value); // Initiate download process
});

// Handle speech synthesis completion
synth.onend = function () {
  isSpeaking = true; // Update speaking flag
  convertBtn.disabled = false; // Re-enable convert button
};

// Function to clear text area content
function resetText() {
  textarea.value = "";
}

// Add reset button event listener
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", resetText);

// --- 1. VARIABLES & STATE ---
let timer;
let isRunning = false;
let totalSeconds = 25 * 60; // Default 25 minutes in seconds

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const alarmSound = document.getElementById('alarm-sound');

// --- 2. NAVIGATION LOGIC (Tab Switching) ---
function showPage(pageId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show the selected section
    const activeSection = document.getElementById(pageId);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }

    // Update active class on menu buttons
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
        // Check if the button click corresponds to the pageId
        if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(pageId)) {
            button.classList.add('active');
        }
    });
}

// --- 3. TIMER LOGIC ---
function updateDisplay() {
    if (!minutesDisplay || !secondsDisplay) return;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    // Add leading zero if less than 10 (e.g., 05 instead of 5)
    minutesDisplay.textContent = mins < 10 ? '0' + mins : mins;
    secondsDisplay.textContent = secs < 10 ? '0' + secs : secs;
}

function startTimer() {
    if (isRunning) return; // Prevent multiple intervals if clicked multiple times

    isRunning = true;
    timer = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            // Timer finished!
            clearInterval(timer);
            isRunning = false;

            // 1. Properly play the alarm audio element
            if (alarmSound) {
                alarmSound.play().catch(error => {
                    console.log("Audio playback failed. Ensure you interacted with the page first:", error);
                });
            }

            // 2. Use a tiny timeout for the alert so the sound actually starts playing first
            setTimeout(() => {
                alert("Time's up! Take a break or get to work!");
            }, 100);
        }
    }, 1000); // Runs every 1 second
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    
    // Stop and rewind the audio if it's currently playing
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    // Get time from settings input when resetting
    if (workTimeInput) {
        totalSeconds = parseInt(workTimeInput.value) * 60;
    } else {
        totalSeconds = 25 * 60;
    }
    updateDisplay();
}

// --- 4. SETTINGS UPDATE LOGIC ---
function applySettings() {
    // If timer is not running, update the display immediately when inputs change
    if (!isRunning && workTimeInput) {
        totalSeconds = parseInt(workTimeInput.value) * 60;
        updateDisplay();
    }
}

// --- 5. EVENT LISTENERS ---
if (startBtn) startBtn.addEventListener('click', startTimer);
if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
if (resetBtn) resetBtn.addEventListener('click', resetTimer);

// Update timer automatically when user changes numbers in Settings
if (workTimeInput) workTimeInput.addEventListener('input', applySettings);
if (breakTimeInput) breakTimeInput.addEventListener('input', applySettings);

// Initial display setup
updateDisplay();
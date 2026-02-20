// Simple synth for UI sounds using Web Audio API
// No external assets required!

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (freq, type, duration, delay = 0) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime + delay);
    oscillator.stop(audioCtx.currentTime + delay + duration);
};

export const playSuccess = () => {
    // Ascending arpeggio
    playTone(440, 'sine', 0.1, 0);       // A4
    playTone(554.37, 'sine', 0.1, 0.1); // C#5
    playTone(659.25, 'sine', 0.2, 0.2); // E5
    playTone(880, 'sine', 0.4, 0.3);    // A5
};

export const playError = () => {
    // Low buzz
    playTone(150, 'sawtooth', 0.2, 0);
    playTone(100, 'sawtooth', 0.4, 0.1);
};

export const playClick = () => {
    // Short tick
    playTone(800, 'triangle', 0.05, 0);
};

export const playRun = () => {
    // Sci-fi charging sound
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
};

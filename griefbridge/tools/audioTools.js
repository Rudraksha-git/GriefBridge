import { pipeline } from '@xenova/transformers';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { WaveFile } = require('wavefile');
import fs from 'fs';

let transcriberPromise = null;


function getTranscriber() {
  if (!transcriberPromise) {
    transcriberPromise = pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
  }
  return transcriberPromise;
}

/**
 * Transcribes a WAV file with segment-level timestamps.
 * Returns { text, segments: [{ start, end, text }] }.
 *
 * IMPORTANT: expects a 16kHz WAV. If users upload mp3/m4a voice notes,
 * convert to wav first (e.g. with ffmpeg: `ffmpeg -i in.m4a -ar 16000 -ac 1 out.wav`).
 * That conversion step is NOT included here — keep it out of scope unless
 * you have time; for the demo, just use .wav sample files.
 *
 * NOTE: this gives time-aligned segments, not WHO is speaking (true speaker
 * diarization, e.g. pyannote, is out of hackathon scope). Instead, capture
 * the speaker from the upload form (e.g. "Voice memo from Papa") and pass
 * it through as `speakerLabel` below.
 */
export async function transcribeAudio(filePath) {
  const model = await getTranscriber();
  const audioData = readAudioAsFloat32(filePath);

  const result = await model(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: true,
  });

  return {
    text: result.text.trim(),
    segments: (result.chunks || []).map((c) => ({
      start: c.timestamp[0],
      end: c.timestamp[1],
      text: c.text.trim(),
    })),
  };
}

/**
 * Reads a WAV file and converts it to mono Float32Array @ 16kHz —
 * the format Whisper expects.
 */
function readAudioAsFloat32(filePath) {
  const buffer = fs.readFileSync(filePath);
  const wav = new WaveFile(buffer);

  wav.toBitDepth('32f');
  wav.toSampleRate(16000);

  let samples = wav.getSamples();

  // Stereo -> mono by averaging channels
  if (Array.isArray(samples) && Array.isArray(samples[0])) {
    const [left, right] = samples;
    const mono = new Float32Array(left.length);
    for (let i = 0; i < left.length; i++) mono[i] = (left[i] + right[i]) / 2;
    samples = mono;
  }

  return samples;
}

/**
 * Full pipeline for one voice memo: transcribe + format as a memory-ready
 * object. `speakerLabel` comes from the upload form (e.g. "Papa", "Maa").
 */
export async function processAudio(filePath, filename, speakerLabel = 'Unknown') {
  const { text, segments } = await transcribeAudio(filePath);

  return {
    type: 'audio',
    sourceFile: filename,
    content: text,
    metadata: { speaker: speakerLabel, segments },
  };
}
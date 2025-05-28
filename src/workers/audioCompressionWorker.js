importScripts('https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js');

self.addEventListener('error', function(e) {
  self.postMessage({ error: `Worker error: ${e.message}` });
});

self.onmessage = async function(e) {
  const { leftChannel, rightChannel, settings } = e.data;
  try {
    let result;
    
    switch(settings.format) {
      case 'mp3':
        if (typeof lamejs === 'undefined' || !lamejs.Mp3Encoder) {
          throw new Error('MP3 encoder library not loaded properly');
        }
        result = await compressToMP3(leftChannel, rightChannel, settings);
        break;
      case 'wav':
        result = await compressToWAV(leftChannel, rightChannel, settings);
        break;
      default:
        throw new Error(`Unsupported format: ${settings.format}. Please use MP3 or WAV format.`);
    }
    
    self.postMessage({
      type: 'complete',
      result: result
    });
  } catch (error) {
    self.postMessage({ 
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error in audio processing'
    });
  }
};

async function compressToMP3(leftChannel, rightChannel, settings) {
  const channels = settings.mode === 'maximum' ? 1 : 
                  settings.mode === 'aggressive' ? Math.min(settings.channels, 2) : 
                  settings.channels;
  const sampleRate = settings.sampleRate;
  
  const originalBitRate = Math.ceil((settings.originalSize * 8) / (settings.duration * 1024));
  let adaptiveBitRate = settings.bitRate;
  const originalSizeMB = settings.originalSize / (1024 * 1024);
  
  if (settings.mode === 'maximum') {
    adaptiveBitRate = Math.min(64, originalBitRate);
    if (originalSizeMB < 1) {
      adaptiveBitRate = Math.min(48, originalBitRate);
    }
  } else if (settings.mode === 'aggressive') {
    adaptiveBitRate = Math.min(96, originalBitRate);
    if (originalSizeMB < 1) {
      adaptiveBitRate = Math.min(64, originalBitRate);
    }
  } else {
    adaptiveBitRate = Math.min(128, originalBitRate);
  }
  
  const mp3encoder = new lamejs.Mp3Encoder(
    channels,
    sampleRate,
    adaptiveBitRate
  );
  
  const mp3Data = [];
  const sampleBlockSize = 1152;
  
  const leftInt16 = new Int16Array(leftChannel.length);
  const rightInt16 = new Int16Array(rightChannel.length);
  
  for (let i = 0; i < leftChannel.length; i++) {
    leftInt16[i] = leftChannel[i] < 0 ? leftChannel[i] * 0x8000 : leftChannel[i] * 0x7FFF;
    if (channels > 1) {
      rightInt16[i] = rightChannel[i] < 0 ? rightChannel[i] * 0x8000 : rightChannel[i] * 0x7FFF;
    }
  }
  
  const totalBlocks = Math.ceil(leftInt16.length / sampleBlockSize);
  let processedBlocks = 0;
  
  for (let i = 0; i < leftInt16.length; i += sampleBlockSize) {
    const leftChunk = leftInt16.slice(i, i + sampleBlockSize);
    const rightChunk = channels > 1 ? rightInt16.slice(i, i + sampleBlockSize) : leftChunk;
    
    const mp3buf = channels > 1 ?
      mp3encoder.encodeBuffer(leftChunk, rightChunk) :
      mp3encoder.encodeBuffer(leftChunk);
    
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
    
    processedBlocks++;
    const progress = (processedBlocks / totalBlocks) * 100;
    
    if (processedBlocks % 10 === 0) {
      self.postMessage({
        type: 'progress',
        progress: progress
      });
    }
  }
  
  const end = mp3encoder.flush();
  if (end.length > 0) {
    mp3Data.push(end);
  }
  
  const blob = new Blob(mp3Data, { type: 'audio/mp3' });
  
  return {
    blob: blob,
    duration: settings.duration,
    sampleRate: settings.sampleRate,
    channels: channels,
    outputFormat: 'mp3'
  };
}

async function compressToWAV(leftChannel, rightChannel, settings) {
  const channels = settings.mode === 'maximum' ? 1 : 
                  settings.mode === 'aggressive' ? Math.min(settings.channels, 2) : 
                  settings.channels;
  const sampleRate = settings.sampleRate;
  
  // Convert float32 to int16
  const leftInt16 = new Int16Array(leftChannel.length);
  const rightInt16 = new Int16Array(rightChannel.length);
  
  for (let i = 0; i < leftChannel.length; i++) {
    leftInt16[i] = leftChannel[i] < 0 ? leftChannel[i] * 0x8000 : leftChannel[i] * 0x7FFF;
    if (channels > 1) {
      rightInt16[i] = rightChannel[i] < 0 ? rightChannel[i] * 0x8000 : rightChannel[i] * 0x7FFF;
    }
  }

  // Calculate data size
  const dataSize = leftInt16.length * channels * 2; // 2 bytes per sample
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // audio format (1 for PCM)
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true); // byte rate
  view.setUint16(32, channels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < leftInt16.length; i++) {
    view.setInt16(offset, leftInt16[i], true);
    offset += 2;
    if (channels > 1) {
      view.setInt16(offset, rightInt16[i], true);
      offset += 2;
    }
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  
  return {
    blob: blob,
    duration: settings.duration,
    sampleRate: settings.sampleRate,
    channels: channels,
    outputFormat: 'wav'
  };
}

// Helper function to write strings to DataView
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
} 
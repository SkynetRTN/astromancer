export class Sonifier {
    private isPlaying = false;
    private audioCtx: AudioContext | null = null;
    private audioSource: AudioBufferSourceNode | null = null;
  
    private interpolateLinear(data: number[], factor: number): number[] {
      const result: number[] = [];
      for (let i = 0; i < data.length - 1; i++) {
        const start = data[i];
        const end = data[i + 1];
        result.push(start);
        for (let j = 1; j <= factor; j++) {
          const t = j / (factor + 1);
          result.push(start * (1 - t) + end * t);
        }
      }
      result.push(data[data.length - 1]);
      return result;
    }
  
    private writeString(view: DataView, offset: number, str: string) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }
  
    public sonification(xValues: number[], yValues: number[], period: number) {
        if (yValues.length === 0) {
          console.error("No data to sonify.");
          return;
        }
      
        const originalPeriod = period;
        const lengthInSeconds = 60;
        const sampleRate = 88200;
        const interpolationFactor = 4;
      
        const numRepeats = Math.min(500, Math.ceil(lengthInSeconds / period));
        const actualLength = Math.min(lengthInSeconds, numRepeats * period);
      
        let repeatedYValues: number[] = [];
        for (let i = 0; i < numRepeats; i++) {
          repeatedYValues = repeatedYValues.concat(yValues);
        }
      
        const interpolatedY = this.interpolateLinear(repeatedYValues, interpolationFactor);
        const numPoints = interpolatedY.length;
      
        const durationPerPoint = (numRepeats * period) / numPoints;
        const samplesPerPoint = Math.floor(sampleRate * durationPerPoint);
        const totalSamples = Math.floor(sampleRate * actualLength);
      
        const minY = Math.min(...interpolatedY);
        const maxY = Math.max(...interpolatedY);
        const normalizedY = interpolatedY.map(y => (y - minY) / (maxY - minY || 1));
      
        const audioData = new Float32Array(totalSamples);
        const constantFreq = 440;
      
        for (let i = 0; i < totalSamples; i++) {
          const time = i / sampleRate;
          const pointIndex = Math.floor(i / samplesPerPoint);
          const volume = normalizedY[Math.min(pointIndex, normalizedY.length - 1)];
          audioData[i] = volume * Math.sin(2 * Math.PI * constantFreq * time);
        }
      
        const int16Data = new Int16Array(totalSamples);
        for (let i = 0; i < totalSamples; i++) {
          int16Data[i] = Math.max(-32767, Math.min(32767, Math.floor(audioData[i] * 32767)));
        }
      
        const bytesPerSample = 2;
        const dataSize = totalSamples * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);
      
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * bytesPerSample, true);
        view.setUint16(32, bytesPerSample, true);
        view.setUint16(34, 16, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);
      
        for (let i = 0, offset = 44; i < int16Data.length; i++, offset += 2) {
          view.setInt16(offset, int16Data[i], true);
        }
      
        const blob = new Blob([new Uint8Array(buffer)], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${originalPeriod}s_sonification.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }  
    
    
    public sonificationBrowser(xValues: number[], yValues: number[], period: number) {
        if (this.isPlaying) {
          this.audioSource?.stop();
          this.audioCtx?.close();
          this.audioCtx = null;
          this.audioSource = null;
          this.isPlaying = false;
          return;
        }
      
        if (yValues.length === 0) {
          console.error("No data to sonify.");
          return;
        }
      
        const lengthInSeconds = 60;
        const sampleRate = 88200;
        const interpolationFactor = 4;
      
        const numRepeats = Math.min(500, Math.ceil(lengthInSeconds / period));
        const actualLength = Math.min(lengthInSeconds, numRepeats * period);
      
        let repeatedYValues: number[] = [];
        for (let i = 0; i < numRepeats; i++) {
          repeatedYValues = repeatedYValues.concat(yValues);
        }
      
        const interpolatedY = this.interpolateLinear(repeatedYValues, interpolationFactor);
        const numPoints = interpolatedY.length;
      
        const durationPerPoint = (numRepeats * period) / numPoints;
        const samplesPerPoint = Math.max(1, Math.floor(sampleRate * durationPerPoint));
        const totalSamples = Math.floor(sampleRate * actualLength);
      
        const minY = Math.min(...interpolatedY);
        const maxY = Math.max(...interpolatedY);
        const normalizedY = interpolatedY.map(y => (y - minY) / (maxY - minY || 1));
      
        const audioData = new Float32Array(totalSamples);
        const constantFreq = 440;
      
        for (let i = 0; i < totalSamples; i++) {
          const time = i / sampleRate;
          const pointIndex = Math.floor(i / samplesPerPoint);
          const volume = normalizedY[Math.min(pointIndex, normalizedY.length - 1)];
          audioData[i] = volume * Math.sin(2 * Math.PI * constantFreq * time);
        }
      
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = this.audioCtx.createBuffer(1, audioData.length, sampleRate);
        buffer.copyToChannel(audioData, 0);
      
        this.audioSource = this.audioCtx.createBufferSource();
        this.audioSource.buffer = buffer;
        this.audioSource.connect(this.audioCtx.destination);
        this.audioSource.start();
      
        this.audioSource.onended = () => {
          this.isPlaying = false;
          this.audioCtx?.close();
          this.audioCtx = null;
          this.audioSource = null;
        };
      
        this.isPlaying = true;
    }
}
  
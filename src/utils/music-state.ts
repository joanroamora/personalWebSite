export const musicSessionKey = 'orbital-music-session-v1';
export const musicVolumeKey = 'orbital-music-volume-v1';
export interface MusicState { enabled:boolean; track:string; time:number; volume:number; }
const clamp = (value:number, min:number, max:number) => Math.max(min, Math.min(max, value));

/** Treat storage as untrusted and optional. IDs survive playlist reordering. */
export function readMusicState(raw:string | null, ids:readonly string[], volumeRaw:string | null = null):MusicState {
  const initial:MusicState = { enabled:false, track:ids[0] ?? '', time:0, volume:.25 };
  if (volumeRaw !== null && volumeRaw.trim() && Number.isFinite(Number(volumeRaw))) initial.volume = clamp(Number(volumeRaw), 0, 1);
  if (!raw) return initial;
  try {
    const value:unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return initial;
    const saved = value as Record<string, unknown>;
    if (typeof saved.track !== 'string' || !ids.includes(saved.track)) return initial;
    return {
      enabled:saved.enabled === true,
      track:saved.track,
      time:typeof saved.time === 'number' && Number.isFinite(saved.time) ? clamp(saved.time, 0, 86400) : 0,
      volume:typeof saved.volume === 'number' && Number.isFinite(saved.volume) ? clamp(saved.volume, 0, 1) : initial.volume,
    };
  } catch { return initial; }
}

export function nextMusicTrack(ids:readonly string[], current:string):string {
  return ids.length ? ids[(ids.indexOf(current) + 1) % ids.length] : '';
}

export function musicPosition(time:number, duration:number):number {
  if (!Number.isFinite(time) || time < 0 || !Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(time, Math.max(0, duration - .25));
}

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { musicTracks } from '../src/data/music.ts';
import { musicPosition, nextMusicTrack, readMusicState } from '../src/utils/music-state.ts';
const ids = musicTracks.map(track => track.id);

test('la música empieza apagada y solo recupera una autorización explícita de esta pestaña', () => {
  assert.deepEqual(readMusicState(null,ids),{enabled:false,track:'clifford',time:0,volume:.25});
  assert.equal(readMusicState('{"enabled":"true","track":"clifford"}',ids).enabled,false);
  const state = readMusicState(JSON.stringify({enabled:true,track:'teresa',time:32.5,volume:.4}),ids);
  assert.deepEqual(state,{enabled:true,track:'teresa',time:32.5,volume:.4});
  assert.equal(readMusicState(JSON.stringify(state),[...ids].reverse()).track,'teresa');
});

test('estado corrupto, pistas retiradas, valores no finitos y recursos extremos son seguros', () => {
  for (const raw of ['invalid','null','42','{}','[]','{"track":"absent","enabled":true}']) {
    const state = readMusicState(raw,ids);
    assert.equal(state.enabled,false);
    assert.equal(state.track,ids[0]);
  }
  assert.deepEqual(readMusicState('{"track":"clifford","time":-32,"volume":20}',ids),{enabled:false,track:'clifford',time:0,volume:1});
  assert.equal(readMusicState(null,ids,'0').volume,0);
  assert.equal(readMusicState(null,ids,'').volume,.25);
  assert.equal(readMusicState(null,ids,'NaN').volume,.25);
  assert.equal(readMusicState(null,ids,'-5').volume,0);
  assert.equal(readMusicState('{"track":"clifford","time":1e309,"volume":1e309}',ids).time,0);
  assert.equal(readMusicState(null,[]).track,'');
});

test('la lista se repite al terminar y la posición recuperada no supera la duración', () => {
  for (const [index,id] of ids.entries()) assert.equal(nextMusicTrack(ids,id),ids[(index+1)%ids.length]);
  assert.equal(nextMusicTrack(ids,'removed'),ids[0]);
  assert.equal(nextMusicTrack([],'none'),'');
  assert.equal(musicPosition(10,100),10);
  assert.equal(musicPosition(999,100),99.75);
  for (const [time,duration] of [[-1,100],[Infinity,100],[10,NaN],[10,0],[10,Infinity]]) assert.equal(musicPosition(time,duration),0);
});

test('las cuatro pistas aportadas existen en src/sounds y contienen audio MP3', async () => {
  assert.equal(ids.length,4);
  assert.equal(new Set(ids).size,4);
  for (const track of musicTracks) {
    assert.ok(track.title);
    const url = new URL(`../src/sounds/${track.file}`,import.meta.url);
    assert.ok((await stat(url)).size > 1000);
    const bytes = await readFile(url);
    assert.ok(bytes.toString('ascii',0,3) === 'ID3' || bytes[0] === 0xff);
  }
});

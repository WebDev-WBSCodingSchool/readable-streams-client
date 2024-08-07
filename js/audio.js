const res = await fetch('http://localhost:8000/audio');

if (!res.ok) throw new Error(`Error! status: ${res.status} - ${res.statusText}`);

const container = document.querySelector('.container');
const audio = document.createElement('audio');
audio.controls = true;
container.appendChild(audio);

const mediaSource = new MediaSource();
audio.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', async () => {
  const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
  const queue = [];

  const processQueue = () => {
    if (!sourceBuffer.updating && queue.length) {
      const chunk = queue.shift();
      sourceBuffer.appendBuffer(chunk);
    }
  };

  sourceBuffer.addEventListener('updateend', processQueue);

  for await (const chunk of res.body) {
    queue.push(chunk);
    processQueue();
  }
});

/* 
const reader = res.body.getReader();
let isStreamDone = false;

while (!isStreamDone) {
  const { value, done } = await reader.read();
  if (done) {
    isStreamDone = true;
    break;
  }
  console.log(value);
}
*/

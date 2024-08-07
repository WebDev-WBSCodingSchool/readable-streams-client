const res = await fetch('http://localhost:8000/audio');

if (!res.ok) throw new Error(`Error! status: ${res.status} - ${res.statusText}`);

for await (const chunk of res.body) {
  console.log(chunk);
}

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

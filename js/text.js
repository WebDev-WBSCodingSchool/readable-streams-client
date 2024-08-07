const res = await fetch('http://localhost:8000/text');

if (!res.ok) throw new Error(`Error! status: ${res.status} - ${res.statusText}`);

const decoder = new TextDecoder();

const container = document.querySelector('.container');
const h1 = document.createElement('h1');
h1.classList.add('text-4xl', 'text-center', 'text-primary');
h1.textContent = 'Never Gonna Give You Up';
container.appendChild(h1);
const p = document.createElement('p');
p.classList.add('text-2xl', 'text-center');
container.appendChild(p);

for await (const chunk of res.body) {
  const decodedChunk = decoder.decode(chunk, { stream: true });
  if (decodedChunk.includes('\n')) {
    p.innerHTML += decodedChunk.replace(/\n/g, '<br>');
    continue;
  }
  p.innerHTML += ` ${decodedChunk} `;
  container.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
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
  const text = decoder.decode(value, { stream: true });
  console.log(text);
} 
*/

const res = await fetch('http://localhost:8000/video');

if (!res.ok) throw new Error(await res.json());

console.log(res.body instanceof ReadableStream);

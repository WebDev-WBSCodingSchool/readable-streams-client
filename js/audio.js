// Get the container element
const container = document.querySelector('.container');
// Add classes to the container
container.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'h-screen');
// Create a button element
const button = document.createElement('button');
// Set the button text content
button.textContent = 'Start streaming 🔈';
// Add classes to the button
button.classList.add(
  'bg-primary',
  'hover:bg-secondary',
  'text-white',
  'font-bold',
  'py-2',
  'px-4',
  'rounded'
);
// Add event listener to the button
button.addEventListener('click', async () => {
  try {
    // Fetching audio stream
    const res = await fetch('http://localhost:8000/audio');
    // Check if the response is ok
    if (!res.ok) throw new Error(`Error! status: ${res.status} - ${res.statusText}`);
    // Hide the button
    button.style.display = 'none';
    // Get DOM elements to display the audio
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.autoplay = true;
    container.appendChild(audio);
    // Create a media source
    const mediaSource = new MediaSource();
    // Set the audio source
    audio.src = URL.createObjectURL(mediaSource);
    // Add event listener to the media source
    mediaSource.addEventListener('sourceopen', async () => {
      try {
        // Add a source buffer to the media source
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        // Create a queue to store the chunks
        const queue = [];
        // Function to process the queue
        const processQueue = () => {
          // Check if the source buffer is not updating and the queue is not empty
          if (!sourceBuffer.updating && queue.length) {
            // Get the first chunk from the queue
            const chunk = queue.shift();
            // Append the chunk to the source buffer
            sourceBuffer.appendBuffer(chunk);
          }
        };
        // Add event listener to the source buffer to process the queue when the previous update ends
        sourceBuffer.addEventListener('updateend', processQueue);
        // Read the stream and push the chunks to the queue
        for await (const chunk of res.body) {
          // Push the chunk to the queue
          queue.push(chunk);
          // Process the queue
          processQueue();
        }
        // End the media source
        mediaSource.endOfStream();
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
});
// Append the button to the container
container.appendChild(button);

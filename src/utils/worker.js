/* eslint-disable no-restricted-globals */
// worker.js – runs in a separate thread

// Simple CSV parser for chunked lines
function parseCSVChunk(chunk, headers) {
  return chunk
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",");
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i] ? values[i].trim() : "";
      });
      return obj;
    });
}

self.onmessage = (e) => {
  const { file } = e.data;
  const reader = new FileReaderSync(); // worker-safe API
  const text = reader.readAsText(file);

  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(",");

  // Process in chunks of 1000 lines to avoid blocking
  const chunkSize = 1000;
  let results = [];
  for (let i = 1; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize);
    const parsed = parseCSVChunk(chunk, headers);
    results = results.concat(parsed);

    // Report progress to main thread
    self.postMessage({
      type: "progress",
      progress: Math.min(100, Math.round((i / lines.length) * 100)),
    });
  }

  // Send back final result
  self.postMessage({
    type: "done",
    rows: results,
  });
};

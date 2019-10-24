// web-worker.js
console.log('load web worker');
console.log('we worker starts to listen to message');

self.addEventListener('message', (event) => {
  if (event.data === 'hello') {
    console.log('web worker receives a message: ' + event.data);
    self.postMessage('ack');
  } else if (event.data === 'close') {
    console.log('close message received');
    self.close();
  } else if (event.data === 'throw_error') {
    // throw an error
    console.log('throw error message received')
    throw new TypeError('error handler in the main thread will handle this');
  } else {
    console.log(event.data);
  }
});

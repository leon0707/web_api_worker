// worker
// some old browsers don't support web worker
if (window.Worker) {
  // create a worker thread
  const worker = new Worker('web-worker.js');
  // send the first msg to worker
  document.getElementById("send_message").onclick = function (e) {
    console.log('send hello to web worker');
    worker.postMessage('hello');
  }

  document.getElementById("terminate_worker").onclick = function (e) {
    console.log('client terminates the web worker');
    // worker.postMessage('terminate');
    worker.terminate();
  }

  document.getElementById("worker_close").onclick = function (e) {
    console.log('client ask the web worker to close itself');
    worker.postMessage('close');
  }

  document.getElementById("throw_error").onclick = function (e) {
    console.log('client ask the web worker to throw an error');
    worker.postMessage('throw_error');
  }
  
  
  worker.addEventListener('message', function(event) {
    if (event.data === 'ack') {
      console.log('main thread received the ack from web worker');
      // let worker terminate itself
      // worker.postMessage('close your thread');
    } else if (event.data === 'cannot terminated by itself') {
      worker.terminate();
    }
  });
  
  worker.addEventListener('error', function(err) {
    // listen to error event caused by web worker
    console.error(err.message, err.filename, err.lineno);
  });
}



const publicVapidKey = "BBIHvrSeWx3OgNG1SwxWsMJcQOSLkpOoKgbJhCw2PD8gxWS2BgVvgjqOqxiMC_590GP2Acb8r1WoRWlG5yRuneQ";

function subscribeUserToPush() {
  return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      };
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return pushSubscription;
    })
    .catch(err => console.error(err));
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check for service worker
if ('serviceWorker' in navigator) {
  subscribeUserToPush()
    .then((subscription) => {
      console.log('subscription succeed');

      document.getElementById("send_notification").onclick = function (e) {
        console.log('ask backend to send a notification to this browser');
        fetch('/send_notification', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            "content-type": "application/json"
          }
        })
        .then((res) => {
          console.log('backend received subscription information');
        });
      }
    })
    .catch(err => console.error(err));

  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log("client received message from service worker: " + JSON.stringify(event.data));
  });
}
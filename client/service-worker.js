function processMessage(message) {
	return self.clients.matchAll({
      includeUncontrolled: true // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
    }).then(clients => {
    	// post messages to client
    	clients[0].postMessage(message);
    	// show notification
    	self.registration.showNotification(message.title, {
	    	body: message.body
	  	});
    });
}



self.addEventListener('push', e => {
  const data = e.data.json();
  console.log('received message from web push server');
  e.waitUntil(
  	processMessage(data)
  );
});

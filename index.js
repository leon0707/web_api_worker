const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(bodyParser.json());

const publicVapidKey =
  'BBIHvrSeWx3OgNG1SwxWsMJcQOSLkpOoKgbJhCw2PD8gxWS2BgVvgjqOqxiMC_590GP2Acb8r1WoRWlG5yRuneQ';
const privateVapidKey = '-d39ccyTKEwEAHF71Y6MkbGoe3aybHArHSBf5VvmWvU';

webpush.setVapidDetails(
  'mailto:test@test.com',
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post('/send_notification', (req, res) => {
  // send a notification
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: 'Push Test', body: 'Notification body' });

  // Pass object into sendNotification
  setTimeout(function() {
    webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
  }, 1000);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

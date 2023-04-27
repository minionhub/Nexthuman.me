const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const express = require('express');
const sgMail = require('@sendgrid/mail');
const configStripe = require('./stripe.json');
const ticketTemplate = require('./emails/ticket').ticketTemplate;

const storagePrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDZ61zhz1MxmuJA
oGSdb6U4BhA3PDfl8V1lHuYCveKVFzcMgVroGplXe/y+84WcyJRAXaHqkSg2giJ5
yydpd6RANz3kQErLjqNnsqTnwWxDl9bohMEiB1Du4gBH8ZyG60luiyXNWN6YX+Tm
fZewUD7KdvRDuFB/kyMwYMbSHN1GqBgzf/pfzg7dZaZI0msaRRNA1fqUYeLAEeF+
lIYcUwE5+EgEmBoou4Fb4q7bjkOORKckbZEt0lqr5gBOh+QHaQr/RDDXvHeASUvn
Ssyj+7pIJLosVd5ke9B9VgLwry4D/60ELfAtQtKyRPejaoJn7A9MZk4yIflXrBUl
rkQFBVu9AgMBAAECggEACjEIugLRODuvIyidLAPBrVoTPhIR5y4fmRAV38DzrNdW
Gr6d+sbrrvy8eE25TPjQfiYi4W6Ce/IgHKQUpskSpHIw8dDT7qswFzRyo+gW4R5j
zaIPykCfV1y4eKTjFihA2eumC/GBD41EjkcHZhaKqTtg9x3SnfTKq4OLKN5yttAl
oQpYshCtP4EBSI56NqAXiC+Sf5Ss/BfwCjEYxIJSvn3oVe12vEG7wssziLHxDcJl
XYWLlZPMEJv/7vYug/sSFrtAvhAzyxn5dMnpBEU+3cxlM6XF0DPWyCqO//ffwedN
q2mMITktYsIxQnWujDL3VKK2yxY0egzc7RZQgCacHQKBgQDwS3R00OJeXWk0mAV/
KSluAuc71PNUm85EvaJLQ8PbQOn3YPY1UZ6RvoW/H9lNLkfjaeBXxR2xbPE0py7K
d5dSh/1tkU8bJM6vRuqna5uJs6HA31r2J0sjqatvah/Oj2wCB6Yh7bIOhM1m9JZ0
XG4JyyEC1o/q1kTTcbKRAEXh3wKBgQDoKYeTjk4N3ULJ7aAsFFRYSx7hkHoeJ9yz
NfOR07UMAzD94YpI7Mo/AGzcstBLrXWyR3ap/RhrEgPeMv1vPlWuoGzPXBB+k6BR
ZDU7ATps9swOmHzU3RVdOnSbKnGpTxHTBJ052I4gTz7vQsDtZaen0x7BDyWDKq1r
IoxljaJN4wKBgEFJXvS2JCrbWlAt1aB9AIKhS04YR5x/UIWguE2WtcoGUwshTwOh
j2Gt0AzjjFjJ8EI7a/as2apxHP/fRHlCEN0dkZ+JUWLglz9MF0kxlWrOYW5TwRUM
DAA+gxOcU9P9Z60NgvfI6w3Cy0PjxFUNH+CNTgTFYwi8+qowRAHdfx8lAoGASWSH
laARENT3vjo+vnCW0Wq+EnTIBix32redjmYs/+UqYbghLTieHxiVUZe9vY7SfE+X
NdnrFD4XtvDLqZU9JP1WKJ9kH3+v2MsjAMo8nCHRFHQkUm6pyFUoc70RPYLfkaQN
yDGrjI9AyAaEUwgl3iohuMp/A15EgG/ljl0eCB0CgYBUs6ANQwBiu5OtC92NxSGw
UMuxIaiPPHncOSxSB3pte3dsqRmKgw0G+n5qFeVL3D9P8wxCbujtslf1iouSpKI+
L4RgsKZAvTOrG6fpKMDD385VieNmkvnhGipeM/lVtjLuZ8d08YsaoC2P6wuF3cbh
oLmzUp8Xzo0ukbBdnRbCAw==
-----END PRIVATE KEY-----`;

exports.getStorageToken = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'Unauthorized');
  }

  const payload = {
    sub: context.auth.uid, // Unique user id string
    name: context.auth.token.email, // Full name of user
    exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes expiration
  };

  const token = jwt.sign(payload, storagePrivateKey, { algorithm: 'RS256' });
  return {
    token,
  };
});

// Secret Key from Stripe Dashboard
const stripe = require('stripe')(configStripe.secret);

// Our app has to use express
const createPaymentIntentApp = express();
// Our app has to use cors
createPaymentIntentApp.use(cors);
// The function that get data from front-end and create a payment session
async function createPaymentIntent(req, res) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.data.amount * 100,
    currency: 'sek',
    metadata: req.body.data.metadata,
  });

  res.status(200).send({
    status: 'success',
    data: {
      clientSecret: paymentIntent.client_secret,
    },
  });
  return;
}
// Creating a route
createPaymentIntentApp.post('/', (req, res) => {
  try {
    createPaymentIntent(req, res);
  } catch (e) {
    res.status(500).send({
      status: 'success',
      data: {
        error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
      },
    });
  }
});
// Exporting our http function
exports.createPaymentIntent = functions.https.onRequest(createPaymentIntentApp);

exports.emailMessage = functions.https.onRequest((req, res) => {
  const ticket = req.body.data;
  return cors(req, res, () => {
    try {
      var text = ticketTemplate(ticket);
      const msg = {
        to: ticket.email,
        from: 'tickets@nexthuman.me',
        subject: 'You have new ticket purchased',
        text: text,
        html: text,
      };
      sgMail.setApiKey('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');
      sgMail.send(msg);
      res.status(200).send({
        status: 'success',
        data: { message: 'Email sent' },
      });
    } catch (e) {
      res.status(500).send({
        status: 'fail',
        data: { message: 'Error' },
      });
    }
  });
});

const bucket = 'gs://nexthuman-backup';

exports.scheduledFirestoreExport = functions.pubsub.schedule('every 24 hours').onRun((context) => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, '(default)');
  console.log('PROJECTID', projectId);

  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      collectionIds: [],
    })
    .then((responses) => {
      const response = responses[0];
      console.log(`Operation Name: ${response['name']}`);
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('Export operation failed');
    });
});

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

function generateSw() {
    const createdAt = new Date().toISOString();
    return `// createdAt: ${new Date().toISOString()}
const createdAt = "${createdAt}"; 
self.addEventListener('install', (event) => {
    console.log("install: ", createdAt)
});
self.addEventListener('activate', (event) => {
    console.log("activate: ", createdAt)
});
`;
}

exports.updateSw = functions.https.onRequest((request, response) => {
    const sw = generateSw();
    admin.database().ref('sw').set(sw).then(() => {
        response.status(200).send();
    }).catch(error => {
        response.status(500).send(error);
    });
});

exports.sw = functions.https.onRequest((request, response) => {
    admin.database().ref('sw').once('value', (snapshot) => {
        const sw = snapshot.val();
        response
            .contentType('application/javascript')
            .send(sw);
    });
});

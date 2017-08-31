const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

function generateSw(revision, { claimOnActivate, skipWaiting } = {}) {
    return `const revision = "${revision}"; 
const claimOnActivate = ${!!claimOnActivate};
const skipWaiting = ${!!skipWaiting};
self.REVISION = revision;
self.addEventListener("install", (event) => {
    console.log("[sw.js] Installed new worker:", self.REVISION);
    if (skipWaiting) {
        event.waitUntil(
            self.skipWaiting()
        );
    }
});
self.addEventListener("activate", (event) => {
    console.log("[sw.js] Activated new worker:", self.REVISION);
    if (claimOnActivate) {
        event.waitUntil(
            self.clients.claim()    
        );
    }    
});
self.addEventListener("fetch", (event) => {
    const path = new URL(event.request.url).pathname;
    if (path === '/test') {
        event.respondWith(new Response(\`From Service Worker: ${revision}\`));
    }
    return;
});
`;
}

exports.generateWorker = functions.https.onRequest((request, response) => {
    const params = request.body;
    admin.database().ref(`${params.uid}/revision`).once('value', (snapshot) => {
        const revision = snapshot.val() || 0;
        const newRevision = revision + 1;
        const sw = generateSw(revision + 1, params);
        admin.database().ref(`${params.uid}/revision`).set(newRevision)
            .then(() => admin.database().ref(`${params.uid}/sw`).set(sw))
            .then(() => {
                response.status(200).send({
                    revision: newRevision,
                    params,
                });
            }).catch(error => {
                response.status(500).send(error);
            });
    });
});

exports.sw = functions.https.onRequest((request, response) => {
    const { uid } = request.query;
    admin.database().ref(`${uid}/sw`).once('value', (snapshot) => {
        const sw = snapshot.val();
        response
            .contentType('application/javascript')
            .send(sw);
    });
});

exports.test = functions.https.onRequest((request, response) => {
    response.send('From Server');
});

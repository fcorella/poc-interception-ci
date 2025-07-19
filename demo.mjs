#!/usr/bin/env node

import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import bodyParser from 'body-parser';

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', './views');

http.createServer(app).listen(3000);
console.log("listening on port 3000");

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.redirect(303, "/home-page.html");
});

// a presentation request will be received if the service worker has not been registered
//
app.post('/presentation-request', (req, res) => {
    console.log("credential issuer received a presentation request");
    console.log("body of presentation request: [" + JSON.stringify(req.body) + "]");
    const challenge = req.body.challenge;
    const callbackURL = req.body.callbackURL;
    res.set('access-control-allow-origin', '*');
    res.render("presentation-request-received", {
        challenge: challenge,
	callbackURL: callbackURL
    })
});

app.use((req, res) => {
    res.status(404).send('NOT FOUND');
});
app.use((err, req, res, next) => {
    console.log("Error: " + err.stack);
    res.status(500).send('INTERNAL ERROR');
});

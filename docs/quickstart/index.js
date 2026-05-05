// Copyright (c) 2024 Learnosity, Apache 2.0 License
//
// Unified quickstart server with all API examples
'use strict';

const Learnosity = require('../../index');
const config = require('./config');
const express = require('express');
const app = express();
const port = 8000;
const domain = 'localhost';

app.set('view engine', 'ejs');

// Serve static CSS files
app.use('/css', express.static('./css'));
// Serve static asset files (images, etc.) from Bootcamp/assets
app.use('/assets', express.static('../../assets'));

// Home page with Start Game button
app.get('/', function (req, res) {
    res.render('home');
});

// Items API - Standalone Assessment
app.get('/play', function (req, res) {
    const learnositySdk = new Learnosity();
    const user_id = Learnosity.Uuid.generate();
    const session_id = Learnosity.Uuid.generate();

    const request = learnositySdk.init(
        'items',
        {
            consumer_key: config.consumerKey,
            domain: domain
        },
        config.consumerSecret,
        {
            user_id: user_id,
            activity_template_id: 'football_questions',
            session_id: session_id,
            activity_id: 'quickstart_examples_activity_001',
            rendering_type: 'assess',
            type: 'submit_practice',
            name: 'Items API Quickstart',
            state: 'initial',
            config: {
                configuration: {
                    onsubmit_redirect_url: `/reportsapi?user_id=${user_id}&session_id=${session_id}`
                }
            }
        }
    );

    res.render('standalone-assessment', { request });
});


// Reports API
app.get('/reportsapi', function (req, res) {

    const { user_id, session_id } = req.query;

    const learnositySdk = new Learnosity();

    const request = learnositySdk.init(
        'reports',
        {
            consumer_key: config.consumerKey,
            domain: req.hostname
        },
        config.consumerSecret,
        {
            reports: [
                {
                    id: 'session-detail',
                    type: 'session-detail-by-item',
                    user_id: user_id,
                    session_id: session_id
                }
            ]
        }
    );

    res.render('reports', { request });
});

app.listen(port, function () {
    console.log(`Server started http://${domain}:${port}. Press Ctrl-c to quit.`);
});


const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const OktaJwtVerifier = require('@okta/jwt-verifier')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

const oktaJwtVerifier = new OktaJwtVerifier({
    clientId: '0oa2ai1wrrVg3pWZX5d7',
    issuer: 'https://dev-7085657.okta.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) => {
    // require every request to have an authorization header
    if (!req.headers.authorization) {
        return next(new Error('Authorization header is required'))
    }
    let parts = req.headers.authorization.trim().split(' ')
    let accessToken = parts.pop()
    oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default')
        .then(jwt => {
            req.user = {
                uid: jwt.claims.uid,
                email: jwt.claims.sub
            }
            next()
        })
        .catch(next) // jwt did not verify!
})
MongoClient.connect(process.env.ATLAS_URI, (err, client) => {
    // ... do something here
    if (err) return console.error(err)
    console.log('Connected to Database')
    require('api')(app, client)
})
app.listen(8081, () => {
    console.log('listening to port localhost:8081')
})
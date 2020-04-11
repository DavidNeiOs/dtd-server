import express, { Application } from 'express'
import session from "express-session"
import connectMongo from "connect-mongo"
import cors from 'cors'
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import passport from 'passport'

import { handleErrors } from "./src/handlers/errorHandlers"
import passportConfig from "./src/handlers/passport"
import { router } from "./src/routes"

const app: Application  = express();

let server: http.Server | https.Server;
dotenv.config();

// If we are in production we are already running in https
if (process.env.NODE_ENV === 'production') {
  server = http.createServer(app)
}
// We are not in production so load up our certificates to be able to 
// run the server in https mode locally
else {
  const certOptions = {
    key: fs.readFileSync(path.resolve('./server.key')),
    cert: fs.readFileSync(path.resolve('./server.crt'))
  }
  server = https.createServer(certOptions, app)
}

const MongoStore = connectMongo(session)

// configure this to only accept requests from client
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.json())
app.use(session({
  secret: "dtd-session",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize());
passportConfig(passport)

// ROUTES
app.use('/', router)

// Error handler
app.use(handleErrors)

export default server


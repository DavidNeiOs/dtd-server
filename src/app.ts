import express, { Application } from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import mongoose from "mongoose"

import { router } from "./routes"
import { storeSchema } from "./schemas/Store"

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

async function startServer() {
  // configure this to only accept requests from client
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded( { extended: false }))
  app.use(cookieParser());

  app.use(express.json())
  app.use('/', router)

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  
  //@ts-ignore
  await mongoose.connect(process.env.MONGO_DB_URL, options)
  mongoose.Promise = global.Promise
  mongoose.connection.on('error', (err) => {
    console.log(`db error: ${err.message}`)
  })

  // models
  mongoose.model('Store', storeSchema)
  
  server.listen(4000, () => console.log('listenning in port 4000 👍'))
}

startServer()

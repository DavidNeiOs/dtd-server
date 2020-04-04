import mongoose, { ConnectionOptions } from "mongoose"
import dotenv from "dotenv"

import StoreSchema from "./schemas/Store"

dotenv.config();

const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

// Had to ignore because of env var can be undefined
//@ts-ignore
mongoose.connect(process.env.MONGO_DB_URL, options)
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.log(`db error: ${err.message}`)
})


// MODELS
mongoose.model('Store', StoreSchema)

// we need to configure mongoose models before importing the server
// so we can use them in the routes
import app from "./app"
const server = app.listen(4000, () => console.log(`Express listenning in port 4000 👍`))
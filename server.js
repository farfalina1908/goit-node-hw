import mongoose from "mongoose"
import app from "./app.js"
import {DB_HOST} from "./config.js"
// GWNQo3zH74tipkTP
// const DB_HOST = "mongodb+srv://Olena:GWNQo3zH74tipkTP@cluster0.ml9cauf.mongodb.net/db-contacts?retryWrites=true&w=majority"
mongoose.connect(DB_HOST)
.then(() => {
   app.listen(3000, () => {
   // console.log("Server running. Use our API on port: 3000")
   console.log("Database connection successful")
})
})
.catch(error => {
   console.log(error.message)
   process.exit(1)
})



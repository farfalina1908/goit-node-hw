import mongoose from "mongoose"
import app from "./app.js"

// GWNQo3zH74tipkTP
// const DB_HOST = "mongodb+srv://Olena:GWNQo3zH74tipkTP@cluster0.ml9cauf.mongodb.net/db-contacts?retryWrites=true&w=majority"

const {DB_HOST, PORT = 3000} = process.env

mongoose.connect(DB_HOST)
.then(() => {
   app.listen(PORT, () => {
   console.log(`Database connection successful on PORT: ${PORT}`)
})
})
.catch(error => {
   console.log(error.message)
   process.exit(1)
})



const mongoose = require('mongoose')

const mongoURI = "mongodb+srv://tharumanoj:admintharu@cluster0.c9nteks.mongodb.net/homeyhelper?retryWrites=true&w=majority"

try {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI , { useNewUrlParser: true })
    console.log('Connected with the database')
}
catch (error) {
    console.log(error)
    process.exit()
}

mongoose.connection.on("connected", function () {
    console.log("Application is connected to Databse");
})


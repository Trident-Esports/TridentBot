const mongoose = require('mongoose')
const fs = require('fs')
const mongoEventFiles = fs.readdirSync("./src/mongo/events").filter(file => file.endsWith(".js"))

module.exports = (client) => {
    client.mongoConnect = async () => {
        for (eventFile of mongoEventFiles) {
            const event = require(`../events/${eventFile}`)
            if (event.once) {
                mongoose.connection.once(event.name, (...args) => event.execute(...args))
            } else {
                mongoose.connection.on(event.name, (...args) => event.execute(...args))
            }
        }
        mongoose.Promise = global.Promise
        await mongoose.connect(
            process.env.client_mongoDB,
            {
                useFindAndModify: false,
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        )
    }
}

require('dotenv').config()

const { env:  {MONGODB_URL, PORT_CLI} } = process
const PORT = PORT_CLI 

const path = require('path')

const { api } = require('./src/api/routes')

const express = require('express')

const { name, version } = require('./package.json')
const { cors } = require('./src/api/middlewares')
const { mongoose } = require('./src/data')
console.debug('starting server')

try {
    console.debug('connecting to database')

    mongoose.connect(MONGODB_URL)
        .then(() => {
            console.info(`connected to database ${MONGODB_URL}`)

            const app = express()

            app.use(cors)
            
            app.use('/api', api)

            // other

            app.get('*', (req, res) => {
                res.status(404).send('This is not the endpoint you\'re looking for')
            })

            app.listen(PORT, () => console.info(`server ${name} ${version} running on port ${PORT}`))

            let interrupted = false

            process.on('SIGINT', () => {
                if (!interrupted) {
                    interrupted = true

                    console.debug('stopping server')

                    console.debug('disconnecting database')

                    mongoose.disconnect()
                        .then(() => console.info('disconnected database'))
                        .catch(error => console.error('could not disconnect from mongo', error))
                        .finally(() => {
                            console.info(`server ${name} ${version} stopped`)
                            return process.exit()
                        })
                }
            })
        })
        .catch(error => {
            console.error('could not connect to mongo', error)
        })
} catch (error) {
    console.error(error)
}
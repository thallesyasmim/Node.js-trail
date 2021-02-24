import express from 'express'
import 'reflect-metadata'

const app = express()

app.listen(3333, () => console.info('*** Server is running ***'))
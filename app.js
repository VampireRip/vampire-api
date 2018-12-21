const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()

app.use((req, res, next) => {
  const origin = req.get('origin') || ''
  if (origin.endsWith('vampire.rip') || origin.endsWith('vampire.ink')) {
    res.set('Access-Control-Allow-Origin', origin)
    res.set('Access-Control-Allow-Methods',
      'POST, GET, OPTIONS, DELETE, PUT, PATCH')
    res.set('Access-Control-Allow-Credentials', 'true')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Cookie')
  }
  next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/github-webhook/vampire-os', require('./webhook/vampire-os'))
app.use('/github-webhook/vampire', require('./webhook/vampire'))

app.use((req, res, next) => {
  if (res.headersSent) return
  res.sendStatus(404)
})

app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return
  if (err instanceof Error) {
    return res.status(res.statusCode || 500).send(err.stack || err)
  }
  res.sendStatus(501)
})

module.exports = app

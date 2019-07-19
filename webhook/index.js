const createHandler = require('github-webhook-handler')
const EventEmitter = require('events')

const events = new EventEmitter()

const handler = createHandler({ secret: process.env.GITHUB_WEBHOOK_SECRET })

handler.on('error', ({ code, error, req, res }) => {
  res.status(code).send({ code, error })
})

handler.on('*', (emitData) => {
  const { id, event, payload } = emitData
  const { ref, repository } = payload
  console.log('receive github event id: ' + id)
  if (repository && ref) {
    console.log('receive update request: ' + repository.name)
    const repo = payload.repository.owner.name + '/' + payload.repository.name
    const branch = repo + '/' + payload.ref.replace('refs/heads/', '')
    events.emit(event + ':' + branch, emitData)
    events.emit(branch, emitData)
    events.emit(event + ':' + repo, emitData)
    events.emit(repo, emitData)
  }
  events.emit(event, emitData)
  events.emit('*', emitData)
})

module.exports = {
  on (e, h) {
    return events.on(e, () => Promise.resolve().then(h).catch(console.error))
  },
  removeAllListeners: events.removeAllListeners.bind(events),
  middleware: handler
}

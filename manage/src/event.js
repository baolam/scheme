const events = require("events");
const EventEmitter = new events.EventEmitter();

EventEmitter.setMaxListeners(10);

module.exports = EventEmitter;
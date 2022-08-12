const e = require("./src/event");

e.addListener("haha", () => {
  console.log(e.listenerCount());
});

setInterval(() => {
  e.emit("haha");
}, 2000);
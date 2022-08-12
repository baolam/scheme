const express = require("express");
const schedule = require("node-schedule");
const database = require("./database");
const event = require("./event");

const router = express.Router();

// API
function get(dt) {
  let r = dt.split(':').map((vl) => parseInt(vl));
  return r[0] * 3600 + r[1] * 60 + r[2];
}

const api = express.Router();
api.get("/:domain", (req, res) => {
  let domain = req.params.domain;
  database.findOne({
    where : {
      reference : domain
    }
  }).then((vl) => {
    // Gửi mã cho thiết bị
    let da = vl.toJSON();
    if (da.manual)
      res.status(200).send(vl.toJSON().active);
    else {
      let time = new Date();
      time = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
      let start = get(da.start);
      let end = get(da.end);
      res.status(200).send((start <= time) && (time <= end));
    }
  })
  .catch(() => {
    res.status(200).send(false);
  });

  event.emit("domain", domain);
});

// Thuộc về giao diện người dùng
const path = require("path");
router.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

router.use("/api", api);

module.exports = router;
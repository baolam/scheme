const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const socketio = require("socket.io");

const { config } = require("dotenv");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  allowEIO3 : true
});

config();

// Cổng cho dịch vụ quản lí
const PORT = 9876;

app.use(cors({
  origin : "*"
}));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/", require("./src/routes"));

const database = require("./src/database");
const event = require("./src/event");

let domain = "";
io.on("connection", (_socket) => {
  database.findAll()
    .then((jobs) => {
      let rst = jobs.map((job) => job.toJSON());
      _socket.emit("load_jobs", rst);
    })
    .catch((err) => {
      console.log(err);
    });
  
  _socket.on("create_job", (job) => {
    database.findOne({
      where : {
        reference : job.reference
      }
    })
    .then((vl) => {
      vl.toJSON();
      _socket.emit("failed", "Job đã tồn tại");
    })
    .catch(() => {
      database.create(job)
        .then(() => {
          io.emit("success");
        })
        .catch(() => {
          io.emit("failed", "Không thể tạo job");
        });
    });
  });

  _socket.on("update_job", (job) => {
    database.update(job, {
      where : {
        reference : job.reference
      }
    })
    .then(() => {
      _socket.emit("success");
    })
    .catch(() => {
      _socket.emit("Không thể cập nhật");
    });
  })

  _socket.on("erase_job", (job) => {
    database.destroy({
      where : {
        reference : job.reference
      }
    })
    .then(() => {
      _socket.emit("success");
    })
    .catch(() => {
      _socket.emit("Không thể xóa");
    })
  });

  // Phát domain lên web
  _socket.emit("domain", domain);
});

event.addListener("domain", (_domain) => {
  if (domain != _domain) {
    io.emit("domain", _domain);
  }
  domain = _domain;
});

server.listen(PORT, () => {
  console.log("Dịch vụ đã chạy tải cổng", PORT);
});
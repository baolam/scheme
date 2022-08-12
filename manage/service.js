const Service = require("node-windows").Service;

const srv = new Service({
  name : "nodelearning",
  description : "Dịch vụ này sẽ khởi tạo server lắng nghe tại cổng 9876",
  script : "F:\\scheme\\manage\\index.js"
});

srv.on("install", () => {
  srv.start();
});

srv.on("error", (err) => {
  console.log(err);
})

srv.on("uninstall", () => {
  srv.stop();
});

srv.install();
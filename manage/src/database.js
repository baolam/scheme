const sequelize = require("sequelize");
const Database = new sequelize.Sequelize({
  database : "learning",
  username : "postgres",
  password : "nguyenducbaolamdethuong0123456789",
  dialect : "postgres",
  port : 5432,
  host : "localhost",
  logging : false
});

// Tiến hành kết nối
// hoặc tạo
Database.authenticate();

const schemes = Database.define("scheme", {
  reference : { // Tên miền
    type : sequelize.STRING
  },
  start : {  // Thời gian bắt đầu
    type : sequelize.STRING
  },
  end : { // Thời gian kết thúc
    type : sequelize.STRING
  },
  active : { // Trạng thái kích hoạt
    type : sequelize.BOOLEAN
  },
  manual : { // Trạng thái thủ công hoặc tự động
    type : sequelize.BOOLEAN
  }
});

// Khởi tạo
schemes.sync();

module.exports = schemes;
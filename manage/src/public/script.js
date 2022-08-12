window.addEventListener("load", () => {
  let socket = io("/");

  let domain_elt = document.getElementById("domain");

  socket.on("domain", (domain) => {
    domain_elt.value = domain;
  })

  function buildth(dt) {
    let td_tag = document.createElement("td");
    td_tag.innerText = dt;
    td_tag.scope = "col";
    return td_tag;
  }

  let table = document.getElementById("domains");

  function handle_key(key, job) {
    switch (key) {
      case "reference":
        return buildth(job[key]);
      case "start":
        return buildth(job[key]);
      case "end":
        return buildth(job[key]);
      default:
        if (key == "active") {
          return buildth(job[key] ? "Có" : "Không");
        }
    }
  }

  function build_button(job, txt, color) {
    let btn = document.createElement("button");

    btn.className = "btn col-sm-6 " + color;
    btn.innerText = txt;

    btn.addEventListener("click", () => {
      console.log(txt);
      if (txt == "Xóa") {
        socket.emit("erase_job", job);
      } else {
        // Đang bật
        if (job.active) {
          socket.emit("update_job", {
            ...job,
            active : false,
            manual : true
          });
        } else {
          socket.emit("update_job", {
            ...job,
            active : true,
            manual : false
          });
        }
      }
    })

    return btn;
  }

  function build_tb(_jobs) {
    for (let job of _jobs) {
      let tr_tag = document.createElement("tr");
      let td_tags = Object.keys(job).map((key) => handle_key(key, job));
      
      for (let td_tag of td_tags.filter(vl => vl != undefined)) {
        tr_tag.appendChild(td_tag);
      }

      // Các nút nhấn
      let div = document.createElement("div");
      div.className = "d-flex flex-grow mb-3 row";

      div.appendChild(build_button(job, ! job.active ? "Bật" : "Tắt", "btn-primary"));
      div.appendChild(build_button(job, "Xóa", "btn-danger"));

      let td = document.createElement("td");
      td.scope = "col";
      td.appendChild(div);

      tr_tag.appendChild(td);
      table.appendChild(tr_tag);
    }
  }

  socket.on("load_jobs", (_jobs) => {
    build_tb(_jobs);
  });

  let button_job = document.getElementById("create_new_job");
  let start_area = document.getElementById("start");
  let end_area = document.getElementById("end");
  let areas = [3, 5, 7];

  function mapping(nodes) {
    return areas.map((area) => {
      let node = nodes[area].childNodes[3];
      return parseInt(node.value);
    });
  }

  function check_condition(st, en) {
    let c = 0;
    for (let i = 0; i < 3; i++) {
      if (st[i] > en[i])
        return false;
      if (st[i] == en[i])
        c++;
    }

    return c < 3;
  }

  function convertStr(arrs) {
    let r = arrs.map((arr) => String(arr));
    return r[0] + ':' + r[1] + ':' + r[2];
  }

  button_job.addEventListener("click", () => {
    let st_rst = mapping(start_area.childNodes)
    let en_rst = mapping(end_area.childNodes);
    if (check_condition(st_rst, en_rst)) {
      let st = convertStr(st_rst);
      let en = convertStr(en_rst);
      let domain_vl = domain_elt.value;
      
      socket.emit("create_job", {
        start : st, end : en, reference : domain_vl,
        active : false, manual : false
      });
    } else {
      alert("Lỗi giá trị");
    }
  });

  socket.on("success", () => {
    window.location.replace(window.location.href);
  });

  socket.on("failed", (nof) => {
    alert(nof);
  });
});
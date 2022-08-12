(() => {
  chrome.runtime.onMessage.addListener((obj, _sender, _resp) => {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let active = this.responseText;
        console.log(active);
        if (active === "true") {
          alert("Không thể dùng được :>");
          window.location.replace("http://localhost:9876");
        } else {
          if (obj.incognito) {
            setInterval(() => {
              alert("Quay lại web trắng học bài đi bẹn êi");
            }, 2000);
          }
        }
      }
    }
    
    xml.open("GET", "http://localhost:9876/api/" + obj.domain);
    xml.send();
  });
})();
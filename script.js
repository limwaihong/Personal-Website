function copyEmail() {
  var emailAddress = "waihonglim@icloud.com";
  navigator.clipboard.writeText(emailAddress).then(
    function () {
      showToast();
    },
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
}

function showToast() {
  var toast = document.getElementById("toast");
  toast.className = "toast show";
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function updateClock() {
  var now = new Date();
  var options = {
    timeZone: "Asia/Kuala_Lumpur",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  var timeString = now.toLocaleTimeString("en-US", options);
  document.getElementById("clock").textContent = timeString + " GMT+8";
}

updateClock();
setInterval(updateClock, 1000);

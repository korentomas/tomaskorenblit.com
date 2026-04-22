(function () {
  try {
    var t = localStorage.getItem("theme") || "paper";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();

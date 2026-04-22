(function () {
  try {
    var t = localStorage.getItem("theme") || "terminal";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();

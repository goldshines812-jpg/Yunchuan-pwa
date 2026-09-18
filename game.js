document.addEventListener("DOMContentLoaded", function () {

  const buttons = document.querySelectorAll("[data-mode]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {

      const mode = button.getAttribute("data-mode");

      alert("按鈕成功！模式：" + mode);

    });
  });

});

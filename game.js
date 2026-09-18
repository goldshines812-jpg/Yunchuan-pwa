document.addEventListener("DOMContentLoaded", function () {

  const modes = document.getElementById("modes");
  const characters = document.getElementById("characters");
  const game = document.getElementById("game");
  const ending = document.getElementById("ending");
  const hud = document.getElementById("hud");

  let selectedMode = "";

  const characterData = {
    boy: [
      { name: "妍妍", avatar: "💄", text: "愛互虧、外向、慢慢觀察" },
      { name: "小雨", avatar: "🌸", text: "慢熟、溫柔、比較謹慎" },
      { name: "娜娜", avatar: "✨", text: "活潑、自信、喜歡直接聊天" }
    ],

    girl: [
      { name: "阿哲", avatar: "😎", text: "幽默、主動、喜歡聊天" },
      { name: "子豪", avatar: "☕", text: "成熟、穩重、慢熱" },
      { name: "小宇", avatar: "🎧", text: "安靜、細心、比較害羞" }
    ],

    free: [
      { name: "妍妍", avatar: "💄", text: "愛互虧、外向、慢慢觀察" },
      { name: "小雨", avatar: "🌸", text: "慢熟、溫柔、比較謹慎" },
      { name: "阿哲", avatar: "😎", text: "幽默、主動、喜歡聊天" },
      { name: "子豪", avatar: "☕", text: "成熟、穩重、慢熱" }
    ]
  };

  function hide(element) {
    if (element) {
      element.classList.add("hidden");
    }
  }

  function show(element) {
    if (element) {
      element.classList.remove("hidden");
    }
  }

  function chooseMode(mode) {
    selectedMode = mode;

    hide(modes);
    hide(game);
    hide(ending);
    hide(hud);

    show(characters);

    characters.innerHTML = "<h2>選擇故事角色</h2>";

    const list = characterData[mode] || characterData.free;

    list.forEach(function (person) {

      const card = document.createElement("div");
      card.className = "character-card";

      card.innerHTML =
        '<div class="avatar">' + person.avatar + "</div>" +
        "<h3>" + person.name + "</h3>" +
        "<p>" + person.text + "</p>";

      card.addEventListener("click", function () {
        startGame(person);
      });

      characters.appendChild(card);
    });
  }

  function startGame(person) {

    hide(characters);
    show(game);
    show(hud);

    game.innerHTML =
      "<h2>你遇見了 " + person.name + "</h2>" +
      '<div class="character-card">' +
      '<div class="avatar">' + person.avatar + "</div>" +
      "<h3>" + person.name + "</h3>" +
      "<p>" + person.text + "</p>" +
      "</div>" +
      "<h2>第一次見面，你會怎麼做？</h2>" +
      '<button id="choice1"><b>主動打招呼</b><span>自然地開始聊天</span></button>' +
      '<button id="choice2"><b>先觀察一下</b><span>看看對方的反應</span></button>' +
      '<button id="choice3"><b>幽默開場</b><span>用輕鬆方式拉近距離</span></button>';

    document.getElementById("choice1").onclick = function () {
      showResult(person, "你主動向對方打招呼，氣氛慢慢熱絡起來。", 20);
    };

    document.getElementById("choice2").onclick = function () {
      showResult(person, "你先觀察對方，找到適合的時機開始聊天。", 10);
    };

    document.getElementById("choice3").onclick = function () {
      showResult(person, "你的幽默讓氣氛變得輕鬆，對方笑了。", 30);
    };
  }

  function showResult(person, text, score) {

    const love = document.getElementById("love");
    const progressBar = document.getElementById("progressBar");

    if (love) {
      love.textContent = score;
    }

    if (progressBar) {
      progressBar.style.width = score + "%";
    }

    game.innerHTML =
      "<h2>" + person.name + " 的反應</h2>" +
      '<div class="character-card">' +
      '<div class="avatar">' + person.avatar + "</div>" +
      "<p>" + text + "</p>" +
      "</div>" +
      '<button id="again"><b>回到模式首頁</b><span>重新選擇模式</span></button>';

    document.getElementById("again").onclick = function () {
      hide(game);
      hide(hud);
      show(modes);
    };
  }

  document.querySelectorAll("[data-mode]").forEach(function (button) {

    button.addEventListener("click", function () {

      const mode = button.getAttribute("data-mode");

      chooseMode(mode);
    });

  });

});

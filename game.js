(()=>{
const D=window.GAME_DATA||{};
const KEY="yunchuan-v06-save";

let state={
  mode:null,
  char:null,
  scene:null,
  score:{love:0,trust:0,spark:0},
  chapter:1
};

const el=id=>document.getElementById(id);

function hideAll(){
  ["modes","characters","game","ending"].forEach(id=>{
    const x=el(id);
    if(x)x.classList.add("hidden");
  });
}

function save(){
  localStorage.setItem(KEY,JSON.stringify(state));
  updateResume();
}

function draw(){
  if(el("love"))el("love").textContent=state.score.love;
  if(el("trust"))el("trust").textContent=state.score.trust;
  if(el("spark"))el("spark").textContent=state.score.spark;
}

function updateResume(){
  const b=el("resumeBtn");
  if(!b)return;
  b.disabled=!localStorage.getItem(KEY);
}

function modeHome(){
  hideAll();
  if(el("modes"))el("modes").classList.remove("hidden");
  updateResume();
}

function pickMode(mode){
  state={
    mode:mode,
    char:null,
    scene:null,
    score:{love:0,trust:0,spark:0},
    chapter:1
  };

  hideAll();

  const box=el("characters");
  if(!box)return;

  box.classList.remove("hidden");

  const list=(D.characters&&D.characters[mode])||[];

  let html="<h2>選擇角色</h2>";

  if(!list.length){
    html+="<p>這個模式的角色正在準備中。</p>";
  }

  list.forEach(c=>{
    html+=`
      <button class="character-card" data-char="${c.id}">
        <div class="avatar">${c.avatar||"💗"}</div>
        <div>
          <strong>${c.name}</strong>
          <p>${c.personality||""}</p>
          <small>📍 ${c.location||""}</small>
        </div>
      </button>
    `;
  });

  html+=`<button id="backMode">← 回模式首頁</button>`;
  box.innerHTML=html;

  box.querySelectorAll("[data-char]").forEach(btn=>{
    btn.onclick=()=>startCharacter(btn.dataset.char);
  });

  const back=el("backMode");
  if(back)back.onclick=modeHome;
}

function startCharacter(id){
  state.char=id;

  const scenes=D.scenarios||[];
  const first=scenes.[0];

  if(!first){
    alert("這個角色的故事正在製作中");
    return;
  }

  state.scene=first.id;
  state.chapter=1;
  save();
  play(first.id);
}

function play(id){
  if(id==="END"){
    finish();
    return;
  }

  const scenes=D.scenarios||[]:
  const scene=scenes.find(s=>s.id===id);

  if(!scene){
    finish();
    return;
  }

  state.scene=id;

  hideAll();

  const game=el("game");
  if(!game)return;

  game.classList.remove("hidden");

  const choices=scene.choices||[];

  let html=`
    <div class="chapter">第 ${state.chapter} 章</div>
    <h2>${scene.title||"互動情境"}</h2>
    <div class="dialogue">
      ${scene.text||scene.dialogue||""}
    </div>
    <div class="choices">
  `;

  choices.forEach((c,i)=>{
    html+=`
      <button class="choice" data-choice="${i}">
        ${c.text}
      </button>
    `;
  });

  html+=`
    </div>
    <button id="gameHome">回模式首頁</button>
  `;

  game.innerHTML=html;

  game.querySelectorAll("[data-choice]").forEach(btn=>{
    btn.onclick=()=>{
      choose(scene,choices[Number(btn.dataset.choice)]);
    };
  });

  const home=el("gameHome");
  if(home)home.onclick=modeHome;

  draw();
  save();
}

function choose(scene,choice){
  if(!choice)return;

  const e=choice.effects||choice.effect||{};

  state.score.love+=Number(e.love||e.affection||0);
  state.score.trust+=Number(e.trust||0);
  state.score.spark+=Number(e.spark||0);

  state.score.love=Math.max(0,state.score.love);
  state.score.trust=Math.max(0,state.score.trust);
  state.score.spark=Math.max(0,state.score.spark);

  state.chapter++;

  draw();

  let reaction="";

  if(choice.reaction){
    reaction=choice.reaction;
  }else if(choice.possible_reactions&&choice.possible_reactions.length){
    const r=choice.possible_reactions[
      Math.floor(Math.random()*choice.possible_reactions.length)
    ];
    reaction=r.text||"";
  }

  const analysis=
    choice.analysis||
    (choice.coach&&choice.coach.analysis)||
    "";

  const next=
    choice.next||
    choice.next_scene||
    "END";

  const game=el("game");

  game.innerHTML=`
    <h2>對方的可能反應</h2>

    <div class="dialogue">
      ${reaction||"對方停了一下，觀察你的反應。"}
    </div>

    ${
      analysis
      ?`<div class="analysis">
          <strong>💡 互動解析</strong>
          <p>${analysis}</p>
        </div>`
      :""
    }

    <div class="score-summary">
      ❤️ 好感 ${state.score.love}
      &nbsp; 🤝 信任 ${state.score.trust}
      &nbsp; 💘 心動 ${state.score.spark}
    </div>

    <button id="nextScene">
      ${next==="END"?"查看結果":"繼續故事"}
    </button>
  `;

  el("nextScene").onclick=()=>{
    save();
    play(next);
  };

  save();
}

function finish(){
  hideAll();

  const end=el("ending")||el("game");
  if(!end)return;

  end.classList.remove("hidden");

  const total=
    state.score.love+
    state.score.trust+
    state.score.spark;

  let title="故事告一段落";
  let text="每一次互動，都可能因人、關係與情境而產生不同結果。";

  if(total>=25){
    title="💞 關係升溫";
    text="你們建立了不錯的互動基礎，故事留下繼續發展的空間。";
  }else if(total>=15){
    title="💕 有點曖昧";
    text="互動正在升溫，但仍需要觀察彼此的節奏與界線。";
  }else{
    title="🌱 慢慢認識";
    text="關係還在建立中。尊重、傾聽與清楚表達比急著推進更重要。";
  }

  end.innerHTML=`
    <div class="ending-card">
      <div style="font-size:64px">💗</div>
      <h2>${title}</h2>
      <p>${text}</p>

      <div class="score-summary">
        ❤️ 好感 ${state.score.love}<br>
        🤝 信任 ${state.score.trust}<br>
        💘 心動 ${state.score.spark}
      </div>

      <button id="restartStory">重新開始這條故事</button>
      <button id="endingHome">回模式首頁</button>
    </div>
  `;

  el("restartStory").onclick=()=>{
    const mode=state.mode;
    const char=state.char;

    state={
      mode:mode,
      char:char,
      scene:null,
      score:{love:0,trust:0,spark:0},
      chapter:1
    };

    startCharacter(char);
  };

  el("endingHome").onclick=modeHome;

  save();
}

function resume(){
  try{
    const x=JSON.parse(localStorage.getItem(KEY));
    if(!x)return;

    state=x;

    if(state.scene){
      play(state.scene);
    }else{
      modeHome();
    }
  }catch(e){
    modeHome();
  }
}

document.querySelectorAll("[data-mode]").forEach(btn=>{
  btn.onclick=()=>pickMode(btn.dataset.mode);
});

if(el("homeBtn"))el("homeBtn").onclick=modeHome;
if(el("resumeBtn"))el("resumeBtn").onclick=resume;

if(el("clearBtn")){
  el("clearBtn").onclick=()=>{
    if(confirm("確定要清除目前的遊戲進度嗎？")){
      localStorage.removeItem(KEY);
      state={
        mode:null,
        char:null,
        scene:null,
        score:{love:0,trust:0,spark:0},
        chapter:1
      };
      modeHome();
    }
  };
}

updateResume();
draw();

})();

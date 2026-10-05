const screens=[...document.querySelectorAll(".screen")];
const show=id=>{
  screens.forEach(s=>s.classList.toggle("active",s.id===id));
  window.scrollTo({top:0,behavior:"instant"});
  document.querySelectorAll(".progress button").forEach((b,i)=>{
    b.style.background=(b.dataset.go===id)?"#f3cbdc":"#6d6673";
  });
};
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.go)));
const cake=document.getElementById("cakeBtn");
let cakeOpened=false;
const prepareReveal=()=>{
  const happy=document.getElementById("happyLine");
  const hena=document.getElementById("henaLine");
  if(happy && hena){
    happy.innerHTML=""; hena.innerHTML="";
    [..."HAPPY BIRTHDAY,"].forEach((ch,i)=>{
      const el=document.createElement("span"); el.className="reveal-char"; el.textContent=ch===" "?"\u00A0":ch;
      el.style.animationDelay=(i*0.075)+"s"; happy.appendChild(el);
    });
    [..."HENA!"].forEach((ch,i)=>{
      const el=document.createElement("span"); el.className="reveal-char"; el.textContent=ch;
      el.style.animationDelay=(1.15+i*0.11)+"s"; hena.appendChild(el);
    });
  }
  const rain=document.querySelector(".reveal-rain");
  if(rain){
    const icons=["🎈","🎈","🎈","💗","💙","💜","💛","💚","🧡","❤️","✨","⭐","🌟","🎀","🎉","🥳","🎊"];
    rain.innerHTML="";
    for(let i=0;i<150;i++){
      const el=document.createElement("span");
      el.textContent=icons[Math.floor(Math.random()*icons.length)];
      el.style.left=Math.random()*100+"%";
      el.style.top=(-15-Math.random()*25)+"vh";
      el.style.fontSize=(18+Math.random()*30)+"px";
      el.style.opacity=.72+Math.random()*.28;
      el.style.setProperty("--drift",((Math.random()-.5)*90)+"px");
      el.style.animation=`revealFallV2 ${4.5+Math.random()*4.5}s linear ${Math.random()*2.4}s infinite`;
      rain.appendChild(el);
    }
  }
};
const openCake=()=>{
  if(cakeOpened) return;
  cakeOpened=true;
  const stage=document.querySelector(".cake-stage");
  stage?.classList.add("cut");
  setTimeout(()=>{
    confetti();
    prepareReveal();
    show("reveal");
  },1050);
};
cake.addEventListener("click",openCake); cake.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openCake()});
function confetti(){
 const box=document.getElementById("confetti"); box.innerHTML="";
 const chars=["✦","•","◆","✧"];
 for(let i=0;i<75;i++){
  const x=document.createElement("span");x.className="conf";x.textContent=chars[Math.floor(Math.random()*chars.length)];
  x.style.left=Math.random()*100+"%";x.style.top=(-10-Math.random()*20)+"%";
  x.style.animationDelay=Math.random()*.6+"s";x.style.fontSize=(8+Math.random()*12)+"px";
  x.style.opacity=.5+Math.random()*.5;box.appendChild(x);
 }
 setTimeout(()=>box.innerHTML="",3500);
}
document.getElementById("nakhreBtn").onclick=()=>{
 const v=60+Math.floor(Math.random()*35);
 document.getElementById("meterFill").style.width=v+"%";
 document.getElementById("meterText").textContent=v+"% — scientifically excessive 😂";
};
document.getElementById("replyBtn").onclick=()=>{
 const b=document.getElementById("replyBtn");b.textContent="Privileges confirmed ✓";setTimeout(()=>b.textContent="Check privileges",1500);
};
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzC_5wbqzDfuCypmhpNki8ZWXGVTrTB_TR2Ck2kgvI7cL-5CgnDfBL4Z_k2yAtbBMK8/exec";

async function submitAnswers(){
  const getRadio = name => document.querySelector(`input[name="${name}"]:checked`)?.parentElement.querySelector("span")?.textContent.trim() || "";
  const getText = id => document.getElementById(id)?.value.trim() || "";
  const answers = {
    q1:getRadio("q1"), q2:getRadio("q2"), q3:getRadio("q3"), q4:getRadio("q4"),
    q5:getText("answer5"), q6:getRadio("q6"), q7:getRadio("q7"), q8:getText("answer8"),
    q9:getRadio("q9"), q10:getRadio("q10"), q11:getText("answer11"), q12:getText("answer12")
  };

  const missing = Object.entries(answers).find(([,value])=>!value);
  if(missing){
    alert("Please answer all twelve questions before submitting. ❤️");
    return;
  }

  const btn=document.getElementById("finishBtn");
  btn.disabled=true;
  btn.textContent="Sending your answers…";

  // Keep the existing backend completely unchanged: two website questions are
  // packed into each of the existing six backend fields.
  const payload={
    q1:`Q1: ${answers.q1} | Q2: ${answers.q2}`,
    q2:`Q3: ${answers.q3} | Q4: ${answers.q4}`,
    q3:`Q5: ${answers.q5} | Q6: ${answers.q6}`,
    q4:`Q7: ${answers.q7} | Q8: ${answers.q8}`,
    q5:`Q9: ${answers.q9} | Q10: ${answers.q10}`,
    q6:`Q11: ${answers.q11} | Q12: ${answers.q12}`
  };

  try{
    await fetch(WEB_APP_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });
  }catch(error){
    console.error("Could not send answers:",error);
  }

  btn.textContent="Answers submitted ✓";
  setTimeout(()=>{confetti();show("final")},700);
}

// One-question-at-a-time flow
const questionCards=[...document.querySelectorAll(".question-steps .q-card")];
let currentQuestion=0;
const prevQuestion=document.getElementById("prevQuestion");
const nextQuestion=document.getElementById("nextQuestion");
const questionSubmit=document.getElementById("finishBtn");
const questionProgress=document.getElementById("questionProgress");
function renderQuestion(){
  questionCards.forEach((card,i)=>card.classList.toggle("active-question",i===currentQuestion));
  questionProgress.textContent=`Question ${currentQuestion+1} of ${questionCards.length}`;
  prevQuestion.style.visibility=currentQuestion===0?"hidden":"visible";
  const last=currentQuestion===questionCards.length-1;
  nextQuestion.style.display=last?"none":"inline-flex";
  questionSubmit.style.display=last?"inline-flex":"none";
  const card=questionCards[currentQuestion];
  if(card) card.scrollIntoView({behavior:"smooth",block:"center"});
}
function answerExists(card){
  if(!card) return false;
  const radio=card.querySelector('input[type="radio"]');
  if(radio) return !!card.querySelector('input[type="radio"]:checked');
  const textarea=card.querySelector("textarea");
  return !!textarea?.value.trim();
}
nextQuestion.onclick=()=>{
  if(!answerExists(questionCards[currentQuestion])){alert("Choose an answer first. ❤️");return;}
  if(currentQuestion<questionCards.length-1){currentQuestion++;renderQuestion();}
};
prevQuestion.onclick=()=>{if(currentQuestion>0){currentQuestion--;renderQuestion();}};
questionSubmit.onclick=submitAnswers;
document.getElementById("restartBtn").onclick=()=>{currentQuestion=0;renderQuestion();show("landing")};
show("landing");
renderQuestion();

// Playful trouble-zone interactions
const modal=document.getElementById("mischiefModal");
const modalTitle=document.getElementById("modalTitle"); const modalText=document.getElementById("modalText"); const modalIcon=document.getElementById("modalIcon");
function openMischief(title,text,icon="⚠️"){modalTitle.textContent=title;modalText.textContent=text;modalIcon.textContent=icon;modal.classList.add("show");modal.setAttribute("aria-hidden","false")}
function closeMischief(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}
document.getElementById("closeMischief").onclick=closeMischief; document.getElementById("modalOk").onclick=closeMischief; modal.addEventListener("click",e=>{if(e.target===modal)closeMischief()});
document.getElementById("dontClickBtn").onclick=()=>{document.getElementById("dontClickStatus").textContent="Status: caught. Curiosity confirmed. 😂";openMischief("You actually clicked it.","We warned you. The birthday system is now slightly disappointed in you. 😂","🚨")};
document.getElementById("gheeBtn").onclick=()=>{const r=["Premium ghee detected. Compliment rejected. 😂","92% ghee. 8% genuine effort. 😌","No ghee detected. Suspiciously honest today."];document.getElementById("gheeStatus").textContent=r[Math.floor(Math.random()*r.length)]};
document.getElementById("bhavBtn").onclick=()=>{const v=55+Math.floor(Math.random()*46);document.getElementById("bhavFill").style.width=v+"%";const t=v>90?"Critical. Madam is unavailable for negotiations. 😂":v>75?"High. Bring ghee before negotiating. 😌":"Manageable. Proceed carefully. 😂";document.getElementById("bhavText").textContent=v+"% — "+t};
const noBtn=document.getElementById("noBtn"),yesNoArea=document.getElementById("yesNoArea");
noBtn.addEventListener("mouseenter",()=>{const maxX=Math.max(0,yesNoArea.clientWidth-noBtn.offsetWidth);noBtn.style.position="absolute";noBtn.style.left=Math.floor(Math.random()*Math.max(1,maxX))+"px";noBtn.style.top=Math.floor(Math.random()*24)+"px"});
noBtn.addEventListener("click",e=>{e.preventDefault();document.getElementById("yesNoStatus").textContent="Nice try. The No button has resigned. 😂"});
document.getElementById("yesBtn").onclick=()=>{document.getElementById("yesNoStatus").textContent="Correct answer. The birthday system approves. ✓";confetti()};

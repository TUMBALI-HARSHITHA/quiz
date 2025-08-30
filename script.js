// ---------------- Data ----------------
const animalQuestions = [
  { emoji: "🐶", correct: "Dog", options: ["Dog","Cat","Lion","Elephant"] },
  { emoji: "🐱", correct: "Cat", options: ["Tiger","Cat","Fox","Horse"] },
  { emoji: "🦁", correct: "Lion", options: ["Wolf","Lion","Tiger","Bear"] },
  { emoji: "🐯", correct: "Tiger", options: ["Leopard","Cheetah","Tiger","Cow"] },
  { emoji: "🐘", correct: "Elephant", options: ["Rhino","Hippo","Elephant","Giraffe"] },
  { emoji: "🐦", correct: "Bird", options: ["Bat","Bird","Squirrel","Frog"] },
  { emoji: "🦊", correct: "Fox", options: ["Dog","Fox","Cat","Deer"] },
  { emoji: "🐻", correct: "Bear", options: ["Pig","Bear","Cow","Sheep"] },
  { emoji: "🐨", correct: "Koala", options: ["Panda","Koala","Sloth","Otter"] },
  { emoji: "🐵", correct: "Monkey", options: ["Monkey","Gorilla","Human","Rabbit"] }
];

const mathQuestions = [
  { question: "5 + 3 = ?", correct: "8", options: ["7","8","9","10"] },
  { question: "9 × 2 = ?", correct: "18", options: ["16","18","20","22"] },
  { question: "12 ÷ 4 = ?", correct: "3", options: ["2","3","4","5"] },
  { question: "15 - 7 = ?", correct: "8", options: ["6","7","8","9"] },
  { question: "6 × 6 = ?", correct: "36", options: ["30","36","42","48"] },
  { question: "100 ÷ 25 = ?", correct: "4", options: ["2","3","4","5"] },
  { question: "7 + 11 = ?", correct: "18", options: ["16","17","18","19"] },
  { question: "9 × 9 = ?", correct: "81", options: ["72","81","90","99"] }
];

const scienceQuestions = [
  { question: "What planet is known as the Red Planet?", correct: "Mars", options: ["Mars","Jupiter","Venus","Mercury"] },
  { question: "What gas do humans need to breathe?", correct: "Oxygen", options: ["Carbon dioxide","Oxygen","Nitrogen","Hydrogen"] },
  { question: "What is H₂O commonly known as?", correct: "Water", options: ["Salt","Oxygen","Water","Ice"] },
  { question: "Which organ pumps blood through the body?", correct: "Heart", options: ["Lungs","Liver","Heart","Kidney"] },
  { question: "What force pulls objects towards Earth?", correct: "Gravity", options: ["Magnetism","Gravity","Friction","Pressure"] },
  { question: "Which is the largest planet in the Solar System?", correct: "Jupiter", options: ["Earth","Saturn","Jupiter","Mars"] }
];

// ---------------- STATE ----------------
let questions = [];
let currentIndex = 0;
let score = 0;
let category = "";

// ---------------- HTML ELEMENTS ----------------
const startScreen = document.getElementById("start-screen");
const quizArea = document.getElementById("quiz-area");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const drawingGame = document.getElementById("drawing-game");

// ---------------- START QUIZ ----------------
function startQuiz(selectedCategory){
  category = selectedCategory;
  startScreen.hidden = true;

  if(category === "drawing"){
    drawingGame.hidden = false;
    startDrawingGame();
    return;
  }

  if(category === "animals") questions = shuffleArray(animalQuestions);
  if(category === "math") questions = shuffleArray(mathQuestions);
  if(category === "science") questions = shuffleArray(scienceQuestions);

  quizArea.hidden = false;
  currentIndex = 0;
  score = 0;
  loadQuestion();
}

// ---------------- QUIZ FUNCTIONS ----------------
function loadQuestion(){
  if(currentIndex >= questions.length){
    showResult();
    return;
  }

  const q = questions[currentIndex];
  let html = `<h3>${q.question}</h3>`;
  if(q.emoji){
    html += `<img src="${q.emoji}" width="200"><br>`;
  }
  questionEl.innerHTML = html;

  optionsEl.innerHTML = "";
  shuffleArray(q.options).forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option";
    btn.onclick = () => checkAnswer(opt, q.correct);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected, correct){
  if(selected === correct) score++;
  document.getElementById("nextBtn").hidden = false;
}

function nextQuestion(){
  currentIndex++;
  document.getElementById("nextBtn").hidden = true;
  loadQuestion();
}

function showResult(){
  quizArea.hidden = true;
  resultEl.hidden = false;
  scoreEl.textContent = `You scored ${score} / ${questions.length}`;
}

function resetQuiz(){
  resultEl.hidden = true;
  startScreen.hidden = false;
}

// ---------------- DRAWING GAME ----------------
const drawingTasks = ["Cat","Dog","Tree","House","Car","Sun","Fish","Flower","Bird","Star"];
let drawingWord = "";

function startDrawingGame(){
  drawingWord = drawingTasks[Math.floor(Math.random()*drawingTasks.length)];
  document.getElementById("draw-task").textContent = "🎨 Draw: " + drawingWord + " or your imagination";
  clearCanvas();
  document.getElementById("drawing-result").hidden = true;
}

document.getElementById("doneDrawingBtn").addEventListener("click", () => {
  const resultBox = document.getElementById("drawing-result");
  resultBox.hidden = false;
  resultBox.innerHTML = `
    <p>You were asked to draw: <b>${drawingWord}</b></p>
    <p>🎉 Show this drawing to your friend and let them guess!</p>
    <button class="btn" onclick="startDrawingGame()">Next Drawing</button>
    <button class="btn" onclick="restartDrawing()">Exit</button>
  `;
});

function restartDrawing(){
  drawingGame.hidden = true;
  startScreen.hidden = false;
}

// ---------------- DRAWING CANVAS ----------------
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;

canvas.addEventListener("mousedown", () => { drawing = true; });
canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener("mouseout", () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener("mousemove", draw);

function draw(e){
  if(!drawing) return;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

// ---------------- HELPER ----------------
function shuffleArray(arr){
  return arr.sort(() => Math.random() - 0.5);
}

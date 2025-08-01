const display = document.getElementById('display');
const preview = document.getElementById('preview');
const historyList = document.getElementById('historyList');
const themeBtn = document.getElementById('toggleTheme');
const buttonsContainer = document.getElementById('buttons');

let themes = ['dark', 'neon', 'rainbow'];
let currentThemeIndex = 0;

const buttons = ['7','8','9','/','C','4','5','6','*','⌫','1','2','3','-','±','0','.','=','+','%'];

buttons.forEach(label => {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.onclick = () => handleButton(label);
  buttonsContainer.appendChild(btn);
});

function handleButton(val) {
  if (val === 'C') return clearDisplay();
  if (val === '⌫') return backspace();
  if (val === '=') return calculate();
  if (val === '±') return toggleSign();

  if (display.innerText === '0') display.innerText = val;
  else display.innerText += val;

  livePreview();
}

function clearDisplay() {
  display.innerText = '0';
  preview.innerText = '= 0';
}

function backspace() {
  let txt = display.innerText;
  display.innerText = txt.length > 1 ? txt.slice(0, -1) : '0';
  livePreview();
}

function toggleSign() {
  display.innerText = '-' + display.innerText;
  livePreview();
}

function calculate() {
  try {
    const result = eval(display.innerText);
    display.innerText = result;
    preview.innerText = '= ' + result;
    addToHistory(result);
  } catch {
    preview.innerText = '= Error';
  }
}

function livePreview() {
  try {
    const result = eval(display.innerText);
    preview.innerText = '= ' + result;
  } catch {
    preview.innerText = '= ?';
  }
}

function addToHistory(result) {
  const li = document.createElement('li');
  li.textContent = display.innerText + ' = ' + result;
  li.onclick = () => (display.innerText = li.textContent.split(' = ')[0]);
  historyList.prepend(li);
  saveHistory();
}

function saveHistory() {
  const list = Array.from(historyList.children).map(li => li.textContent);
  localStorage.setItem('calc-history', JSON.stringify(list));
}

function loadHistory() {
  const list = JSON.parse(localStorage.getItem('calc-history') || '[]');
  historyList.innerHTML = '';
  list.forEach(txt => {
    const li = document.createElement('li');
    li.textContent = txt;
    li.onclick = () => (display.innerText = li.textContent.split(' = ')[0]);
    historyList.appendChild(li);
  });
}

function clearHistory() {
  historyList.innerHTML = '';
  localStorage.removeItem('calc-history');
}

function saveMemory() {
  localStorage.setItem('calc-memory', display.innerText);
}

function loadMemory() {
  const val = localStorage.getItem('calc-memory') || '0';
  display.innerText = val;
  livePreview();
}

// 🌈 Theme Toggle
themeBtn.onclick = () => {
  document.body.className = themes[++currentThemeIndex % themes.length];
};

// 🎙️ Voice Input
function startVoiceInput() {
  const rec = new webkitSpeechRecognition() || new SpeechRecognition();
  rec.lang = 'en-US';
  rec.start();
  rec.onresult = e => {
    display.innerText = e.results[0][0].transcript.replace('x', '*').replace('divided by', '/');
    livePreview();
  };
}

// ⌨️ Shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') calculate();
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Escape') clearDisplay();
  if (e.ctrlKey && e.key === 'c') navigator.clipboard.writeText(display.innerText);
});

window.onload = loadHistory;

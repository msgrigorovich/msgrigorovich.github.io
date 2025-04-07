
const container = document.querySelector('.terminal-container');

// Элементы: текущая строка и исчезающая
const activeLine = document.createElement('div');
const fadedLine = document.createElement('div');

activeLine.className = 'typing-text';
fadedLine.className = 'typing-text faded-line';

container.appendChild(fadedLine);
container.appendChild(activeLine);

function resetTyping(el) {
  el.style.animation = 'none';
  el.offsetWidth; // trigger reflow
  el.style.animation = '';
  el.classList.add('animate-typing');
}

function cycle() {
  // 1. Переносим содержимое в fadedLine
  fadedLine.textContent = activeLine.textContent;
  fadedLine.classList.remove('animate-fade-up');

  // 2. Запускаем анимацию вверх и растворения
  setTimeout(() => {
    fadedLine.classList.add('animate-fade-up');
  }, 50); // краткая задержка для reflow

  // 3. Подготавливаем activeLine для следующего цикла
  activeLine.textContent = 'Hello, World!';
  activeLine.classList.remove('animate-typing');
  resetTyping(activeLine);
}

// Старт первого цикла
activeLine.textContent = 'Hello, World!';
resetTyping(activeLine);

// Запуск по циклу
setInterval(cycle, 4500);

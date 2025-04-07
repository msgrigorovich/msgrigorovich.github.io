
function startTyping() {
    const el = document.querySelector('.typing-text');
    el.style.animation = 'typing 1.5s steps(13, end) forwards, blink 0.7s step-end infinite';
  
    setTimeout(() => {
      el.style.animation = 'none';
      void el.offsetWidth;
      setTimeout(startTyping, 1500);
    }, 1500);
  }
  
  startTyping();
  
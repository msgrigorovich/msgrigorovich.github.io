
function startTyping() {
    const el = document.querySelector('.typing-text');
  
    // Start typing
    el.style.animation = 'typing 1.5s steps(13, end) forwards, blink 0.7s step-end infinite';
  
    // Stay text on a screen for 1.5 sec after typing
    setTimeout(() => {
      el.style.animation = 'none';
      el.textContent = ''; // clear text
      void el.offsetWidth;
  
      // After 0.1 sec return line and restart animation
      setTimeout(() => {
        el.textContent = 'Hello, World!';
        startTyping();
      }, 100);
    }, 3000); // 1.5 (typing) + 1.5 (pause)
  }
  
  startTyping();  
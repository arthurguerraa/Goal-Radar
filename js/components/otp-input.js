// js/components/otp-input.js

function initOtpInput(selector) {
  const digits = document.querySelectorAll(selector);
  if (!digits.length) return;

  digits.forEach((input, index) => {

    input.addEventListener('keyup', (e) => {
      // Ignora teclas de controle exceto backspace
      if (e.key === 'Backspace') {
        input.value = '';
        input.classList.remove('is-filled');
        if (index > 0) digits[index - 1].focus();
        return;
      }

      // Aceita só números
      input.value = input.value.replace(/[^0-9]/g, '');

      if (input.value) {
        input.classList.add('is-filled');
        if (index < digits.length - 1) {
          digits[index + 1].focus();
        }
      } else {
        input.classList.remove('is-filled');
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

      pasted.split('').slice(0, 6).forEach((digit, i) => {
        if (digits[i]) {
          digits[i].value = digit;
          digits[i].classList.add('is-filled');
        }
      });

      const lastIndex = Math.min(pasted.length, digits.length) - 1;
      digits[lastIndex].focus();
    });

  });
}
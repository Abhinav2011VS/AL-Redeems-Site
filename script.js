document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('verify-slider');
  const sliderStatus = document.getElementById('slider-status');
  const sliderContainer = document.getElementById('slider-verify');
  const codeBox = document.getElementById('code-box');

  slider.addEventListener('input', () => {
    if (parseInt(slider.value) >= 100) {
      slider.disabled = true;
      sliderStatus.textContent = '✅';
      sliderContainer.style.opacity = 0;
      setTimeout(() => {
        sliderContainer.style.display = 'none';
        codeBox.style.display = 'block';
        codeBox.classList.add('fadeIn');
        loadRedeemCode(); // only load code after slider is passed
      }, 500);
    }
  });
});

function loadRedeemCode() {
  fetch('redeem.json')
    .then(response => response.json())
    .then(redeemData => {
      const today = new Date();
      const codeText = document.getElementById("code-text");
      const copyBtn = document.getElementById("copy-btn");
      const statusMsg = document.getElementById("status-msg");

      const codeInfo = redeemData[0]; // Only one code at a time
      const expireDate = new Date(codeInfo.expires);
      const soonDate = new Date(codeInfo.expiresSoon);

      if (today > expireDate) {
        codeText.textContent = "No working redeem codes right now 😞";
        copyBtn.style.display = "none";
        statusMsg.textContent = "";
      } else {
        codeText.textContent = codeInfo.code;
        copyBtn.style.display = "inline-block";
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(codeInfo.code);
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
        };

        statusMsg.textContent = (today >= soonDate)
          ? "⚠️ Expires Soon!"
          : "✅ Working";
      }
    })
    .catch(error => {
      console.error("Failed to load redeem code:", error);
      document.getElementById("code-text").textContent = "Error loading code.";
    });
}

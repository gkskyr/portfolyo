const leftPupil = document.getElementById('leftPupil');
const rightPupil = document.getElementById('rightPupil');
const kafa = document.getElementById('kafa');
const button1 = document.getElementById('button1');
const container = document.querySelector('.face-container');

// Göz merkezleri
const eyeCenters = {
  left: { x: 700, y: 320 },
  right: { x: 805, y: 320 }
};

// Gözleri fareye doğru oynatma
function movePupil(pupil, center, mouseX, mouseY) {
  const dx = mouseX - center.x;
  const dy = mouseY - center.y;
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 12);
  const angle = Math.atan2(dy, dx);
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist;
  pupil.style.transform = `translate(${x}px, ${y}px)`;
}

// Gözleri takip ettir
document.addEventListener('mousemove', (e) => {
  movePupil(leftPupil, eyeCenters.left, e.clientX, e.clientY);
  movePupil(rightPupil, eyeCenters.right, e.clientX, e.clientY);
});



ddEventListener('click', () => {
  window.location.href = "ozelliklerim.html";
});
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

// Göz kırpma animasyonu
let frame = 1;
const frameCount = 8;
let animating = false;

const kirpmaInterval = setInterval(() => {
  if (animating) return;
  animating = true;

  const animation = setInterval(() => {
    kafa.src = `medya/kirpma/kirpma${frame}.png`;

    if (frame === 2) {
      leftPupil.style.display = "none";
      rightPupil.style.display = "none";
    }

    frame++;

    if (frame > frameCount) {
      clearInterval(animation);
      kafa.src = "medya/kafa.png";
      frame = 1;
      animating = false;
      leftPupil.style.display = "block";
      rightPupil.style.display = "block";
    }
  }, 83);
}, 2500);

// Hover animasyonu (button1 için)
let button1Frame = 1;
const button1FrameCount = 25;
let button1Animating = false;
let button1AnimationInterval;

button1.addEventListener('mouseenter', () => {
  kafa.style.transform = "translateX(-8px)";
  if (button1Animating) return;

  clearInterval(kirpmaInterval);
  animating = false;

  button1Animating = true;
  button1Frame = 1;

  button1AnimationInterval = setInterval(() => {
    container.style.width = "846px";
    container.style.height = "692px";
    kafa.style.width = "846px";
    kafa.style.height = "692px";
    kafa.src = `medya/buton1/${button1Frame}.png`;
    leftPupil.style.display = "none";
    rightPupil.style.display = "none";
    button1Frame++;

    if (button1Frame > button1FrameCount) {
      clearInterval(button1AnimationInterval);
      button1Animating = false;
      kafa.style.transform = "none";

      container.style.width = "500px";
      container.style.height = "500px";
      kafa.style.width = "500px";
      kafa.style.height = "500px";

      kafa.src = "medya/kafa.png";
      leftPupil.style.display = "block";
      rightPupil.style.display = "block";
    }
  }, 100);
},10000);
button1.addEventListener('click', () => {
  window.location.href = "ozelliklerim.html";
});
button2.addEventListener('click', () => {
  window.location.href = "yaptiklarim.html";
});
button3.addEventListener('click', () => {
  window.location.href = "banaulasin.html";
});


















const kutu = document.getElementById('renkKutusu');
// Tüm yuvarlak butonları seç
document.querySelectorAll('.circle-btn').forEach(button => {
  // Butonun arka plan rengini al
  const renk = button.style.backgroundColor;

  // Hover başladığında kutunun rengi değişsin
  button.addEventListener('mouseenter', () => {
    kutu.style.backgroundColor = renk;
  });

  // Hover bittiğinde kutu eski haline dönsün
  button.addEventListener('mouseleave', () => {
    kutu.style.backgroundColor = '#eee';
  });
});
function metniBuyut(numara) {
  for (let i = 1; i <= 7; i++) {
    const metin = document.getElementById(`metin${i}`);
    if (metin) metin.classList.remove("aktif-metin");
  }

  const aktif = document.getElementById(`metin${numara}`);
  if (aktif) aktif.classList.add("aktif-metin");
}
function renkDegistir(numara) {
  const renkler = [
    "#ff7b81", // 1 - kırmızı
    "#ffb37b", // 2 - turuncu
    "#fff17b", // 3 - sarı
    "#85ff7b", // 4 - yeşil
    "#7befff", // 5 - turkuaz
    "#7b8eff", // 6 - mavi
    "#be7bff"  // 7 - mor
  ];

  const kutu = document.getElementById("renkKutusu");
  kutu.style.backgroundColor = renkler[numara - 1];
}
function videoGor(numara) {
  for (let i = 1; i <= 7; i++) {
    const vid = document.getElementById(`video${i}`);
    vid.pause();
    vid.currentTime = 0;
    vid.style.display = "none";
  }

  const aktifVideo = document.getElementById(`video${numara}`);
  aktifVideo.style.display = "block";
  aktifVideo.play();
}



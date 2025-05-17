// DOM'dan göz bebekleri, kafa, buton ve container seçiliyor
const leftPupil = document.getElementById('leftPupil');
const rightPupil = document.getElementById('rightPupil');
const kafa = document.getElementById('kafa');
const hoverButton = document.getElementById('hoverButton');
const container = document.querySelector('.face-container');

// Gözlerin merkez noktaları — mouse ile hareketin referansı
const eyeCenters = {
  left: { x: 705, y: 325 },
  right: { x: 815, y: 330 }
};

// Fare hareket ettikçe göz bebekleri dönsün
document.addEventListener('mousemove', (e) => {
  movePupil(leftPupil, eyeCenters.left, e.clientX, e.clientY);
  movePupil(rightPupil, eyeCenters.right, e.clientX, e.clientY);
});

// Göz bebeği nasıl hareket eder onu hesaplayan fonksiyon
function movePupil(pupil, center, mouseX, mouseY) {
  const dx = mouseX - center.x; // yatay fark
  const dy = mouseY - center.y; // dikey fark
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 12); // maksimum mesafe 12px
  const angle = Math.atan2(dy, dx); // açıyı bul
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist;
  pupil.style.transform = `translate(${x}px, ${y}px)`; // CSS ile oynatma
}

// Göz kırpma animasyonu için değişkenler
let frame = 1;
const frameCount = 8;
let animating = false;

// Belirli aralıklarla göz kırpma başlasın
const kirpmaInterval = setInterval(() => {
  if (animating) return;
  animating = true;

  const animation = setInterval(() => {
    //hata bakalım1
    console.log("Şu anki kare:", frame);
   kafa.src = `medya/kirpma/kirpma${frame}.png?ts=${Date.now()}`;

    // Göz kırpmanın ikinci karesinde gözler gizleniyor
    if (frame === 2) {
      leftPupil.style.display = "none";
      rightPupil.style.display = "none";
    }

    frame++;

    // Animasyon bittiğinde eski haline dön
    if (frame > frameCount) {
      clearInterval(animation);
      kafa.src = "medya/kafa.png";
      frame = 1;
      animating = false;
      //hata ayıkla2
      console.log("Animasyon bitti");
      leftPupil.style.display = "block";
      rightPupil.style.display = "block";
    }
  }, 83); // 12 fps hızında (1000/12 ≈ 83ms)
}, 5500); // Her 5.5 saniyede bir kırpma

// Hover animasyonu için değişkenler
/*let hoverFrame = 1;
const hoverFrameCount = 19;
let hoverAnimating = false;
let hoverAnimationInterval;

// Butonun üzerine gelinince animasyon başlasın
hoverButton.addEventListener('mouseenter', () => {
  if (hoverAnimating) return; // Zaten oynuyorsa tekrar başlama

  clearInterval(kirpmaInterval); // Göz kırpmayı durdur
  animating = false;

  hoverAnimating = true;
  hoverFrame = 1;

  // Göz bebeklerini gizle
  leftPupil.style.display = "none";
  rightPupil.style.display = "none";

  // Kafa ve container büyüsün (class ekleniyor)
  kafa.classList.add("hover-scale");
  container.classList.add("hover-buyuk");

  // Hover animasyon karelerini sırayla göster
  hoverAnimationInterval = setInterval(() => {
    kafa.src = `medya/buton1/${hoverFrame}.png`;
    hoverFrame++;

    if (hoverFrame > hoverFrameCount) {
      clearInterval(hoverAnimationInterval);
      hoverAnimating = false;

      // Ana kafaya geri dön
      kafa.src = "medya/kafa.png";
      kafa.classList.remove("hover-scale");
      container.classList.remove("hover-buyuk");

      // Gözleri tekrar göster
      leftPupil.style.display = "block";
      rightPupil.style.display = "block";
    }
  }, 83); // Yine saniyede 12 kare
}); */

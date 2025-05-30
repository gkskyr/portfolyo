document.addEventListener('DOMContentLoaded', () => {
  const leftPupil = document.getElementById('leftPupil');
  const rightPupil = document.getElementById('rightPupil');
  const kafa = document.getElementById('kafa');
  const button1 = document.getElementById('button1');
  const button2 = document.getElementById('button2');
  const container = document.querySelector('.face-container');

  // Göz merkezleri
  const eyeCenters = {
    left: { x: 700, y: 320 },
    right: { x: 805, y: 320 }
  };

  // Gözleri fareye doğru oynatma
  function movePupil(pupil, center, mouseX, mouseY) {
    if (!pupil) return; // If pupil doesn't exist, don't try to move it
    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 12);
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    pupil.style.transform = `translate(${x}px, ${y}px)`;
  }

  // Gözleri takip ettir - only add if elements exist
  if (leftPupil && rightPupil) {
    document.addEventListener('mousemove', (e) => {
      movePupil(leftPupil, eyeCenters.left, e.clientX, e.clientY);
      movePupil(rightPupil, eyeCenters.right, e.clientX, e.clientY);
    });
  }

  // Button2 mini buttons toggle function
  if (button2) {
    button2.addEventListener('click', () => {
      const wrapper = document.querySelector('.buton2-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('show-mini-buttons');
      }
    });
  }

  const button3 = document.getElementById('button3');
  if (button3) {
    button3.addEventListener('click', () => {
      window.location.href = "banaulas.html";
    });
  }

  const butonlar = document.querySelectorAll('.yuvarlak-buton');
  const hoverVideoKutusu = document.getElementById('hoverVideoKutusu');
  const hoverVideo = document.getElementById('hoverVideo');
  const hoverVideoSource = document.getElementById('hoverVideoSource');

  // Only add hover video functionality if necessary elements exist
  if (butonlar.length > 0 && hoverVideoKutusu && hoverVideo && hoverVideoSource) {
    butonlar.forEach(buton => {
      buton.addEventListener('click', () => {
        const mesaj = buton.getAttribute('data-mesaj');
        const mesajAlani = buton.nextElementSibling;
        if (mesajAlani) {
          mesajAlani.textContent = mesaj;
        }
      });
    });

    butonlar.forEach(buton => {
      buton.addEventListener('mouseenter', () => {
        const videoYolu = buton.dataset.video;
        console.log('Mouse entered button, video path:', videoYolu);
        if (videoYolu) {
          hoverVideoSource.src = videoYolu;
          hoverVideo.load();
          hoverVideoKutusu.style.display = 'block';
          console.log('Video should be visible now');
        }
      });

      buton.addEventListener('mouseleave', () => {
        console.log('Mouse left button, hiding video');
        hoverVideoKutusu.style.display = 'none';
        hoverVideo.pause();
      });
    });
  }
});



document.addEventListener('DOMContentLoaded', function() {
    const buton1 = document.getElementById('buton1');
    let animationInterval;
    let currentFrame = 1;
    const totalFrames = 25;
    let isAnimating = false;

    // Resimleri önceden yükle
    const images = [];
    for(let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `medya/buton1/${i}.png`;
        images.push(img);
    }

    // Animasyon fonksiyonu
    function animate() {
        buton1.style.backgroundImage = `url(medya/buton1/${currentFrame}.png)`;
        buton1.style.backgroundSize = 'cover';
        buton1.style.backgroundPosition = 'center';
        
        currentFrame++;
        if (currentFrame > totalFrames) {
            currentFrame = 1;
            // Animasyon tamamlandığında
            clearInterval(animationInterval);
            buton1.style.backgroundImage = 'none';
            isAnimating = false; // Yeni hover olaylarına izin ver
        }
    }

    // Hover olayları
    buton1.addEventListener('mouseenter', () => {
        // Eğer animasyon devam ediyorsa, yeni hover olayını yoksay
        if (!isAnimating) {
            isAnimating = true;
            currentFrame = 1;
            animationInterval = setInterval(animate, 40); // 25 FPS
        }
    });

    buton1.addEventListener('mouseleave', () => {
        // Mouse butondan çıktığında hiçbir şey yapma
        // Animasyon kendi kendini tamamlayacak
    });
}); 
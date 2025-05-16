// Göz takibi için değişkenler
const gozBebekler = document.querySelectorAll('.goz-bebegi');
const maxHareket = 5;

// Fare hareketini takip et
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    gozBebekler.forEach(gozBebegi => {
        const rect = gozBebegi.getBoundingClientRect();
        const gozX = rect.left + rect.width / 2;
        const gozY = rect.top + rect.height / 2;
        
        // Fare ve göz arasındaki açıyı hesapla
        const açı = Math.atan2(mouseY - gozY, mouseX - gozX);
        
        // Göz bebeği hareketini sınırla
        const hareketX = Math.cos(açı) * maxHareket;
        const hareketY = Math.sin(açı) * maxHareket;
        
        gozBebegi.style.transform = `translate(${hareketX}px, ${hareketY}px)`;
    });
});

// Buton animasyonu için değişkenler
const buton1 = document.getElementById('buton1');
let animasyonCalisiyor = false;
let frameIndex = 1;
const frameCount = 25;
const frameInterval = 40; // 25 FPS için 40ms

// Buton1 animasyonu
function buton1Animasyon() {
    if (frameIndex <= frameCount) {
        buton1.style.backgroundImage = `url('medya/buton1/${frameIndex}.png')`;
        frameIndex++;
        setTimeout(buton1Animasyon, frameInterval);
    } else {
        frameIndex = 1;
        animasyonCalisiyor = false;
    }
}

// Buton1 hover olayı
buton1.addEventListener('mouseenter', () => {
    if (!animasyonCalisiyor) {
        animasyonCalisiyor = true;
        buton1Animasyon();
    }
});

buton1.addEventListener('mouseleave', () => {
    // Mouse butondan çıktığında hiçbir şey yapma
    // Animasyon kendi kendini tamamlayacak
}); 
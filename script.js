document.addEventListener('DOMContentLoaded', () => {

    // ===== CONFIGURATION =====
    
    // 1. Set the date when the relationship STARTED.
    // This MUST be a date in the past.
    const relationshipStartDate = new Date("2025-05-20T22:00:00");

    // 2. Add the UNIQUE ID of each photo from Google Drive here.
    const photoIDs = [
        "1uepgrh9pMn0xD_DNvebbK5vPu4IMyreK",
        "1Or3vCArGnaD0Rjo0Hso_OiZDOeTiQaVD",
        "1PmkMtamRRQrKb67Yp9KIA3d2AStKxxxy","1kQpFUw0e5GGsoG7thxqW8keSSMYtS3R9","1SP2t9jiYXuR-0zSSx1ZzKZ-s7Tc5Nv2q",
      "1NhUuIZO2cpOyZyjMb_XuOBOL3LG48WSP",
    ];

    // ===== EASTER EGG CONFIGURATION =====
    // 3. Customize the message that appears when clicking the heart.
    const heartClickMessage = "Я тебя очень люблю!♥️"; 
    // 4. Set the URL for your audio file. (e.g., from Google Drive, Imgur, or a direct link)
    // IMPORTANT: Make sure this URL is directly accessible (like your Google Drive images).
    // Ensure you have an 'sound.mp3' file in the root of your project or update the path.
    const audioFileUrl = "sound.mp3"; 

    // ===== LOTTIE ANIMATION INITIALIZATION =====
    // Ensure the paths to your JSON files are correct!
    const lottieHeartPlayer = document.getElementById('lottie-heart');
    if (lottieHeartPlayer) {
        lottieHeartPlayer.src = 'animations/love.json'; // Set src for the main heart
    }

    const lottieHeart2Player = document.getElementById('lottie-heart2');
    if (lottieHeart2Player) {
        lottieHeart2Player.src = 'animations/Flying heart.json'; // Set src for the smaller heart
    }
    
    // ===== 1. CASCADING "COUNT UP" TIMER =====
    const elements = {
        months: document.getElementById('months'),
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
    };

    function updateNumber(element, number) {
        const safeNumber = isNaN(number) ? 0 : number;
        const value = String(safeNumber).padStart(2, '0');
        if (element.innerText !== value) {
            element.classList.add('is-updating');
            setTimeout(() => {
                element.innerText = value;
                element.classList.remove('is-updating');
            }, 200);
        }
    }
    
    function updateCounter() {
        const now = new Date();
        const diff = now - relationshipStartDate;

        if (diff < 0) {
            clearInterval(countdownInterval);
            Object.values(elements).forEach(el => updateNumber(el, 0));
            return;
        }

        let tempStartDate = new Date(relationshipStartDate);
        let monthCount = (now.getFullYear() - tempStartDate.getFullYear()) * 12;
        monthCount -= tempStartDate.getMonth();
        monthCount += now.getMonth();
        if (now.getDate() < tempStartDate.getDate()) {
            monthCount--;
        }
        
        tempStartDate.setMonth(tempStartDate.getMonth() + monthCount);
        const leftoverDiff = now - tempStartDate;
        const days = Math.floor(leftoverDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((leftoverDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((leftoverDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((leftoverDiff % (1000 * 60)) / 1000);

        updateNumber(elements.months, monthCount);
        updateNumber(elements.days, days);
        updateNumber(elements.hours, hours);
        updateNumber(elements.minutes, minutes);
        updateNumber(elements.seconds, seconds);
    }
    
    const countdownInterval = setInterval(updateCounter, 1000);
    updateCounter();

    // ===== 2. DYNAMIC PHOTO ALBUM & LIGHTBOX FUNCTIONALITY =====
    const galleryEl = document.getElementById('photo-gallery');
    const lightboxEl = document.getElementById('lightbox');
    const lightboxImageEl = document.getElementById('lightbox-image');
    const lightboxCloseEl = document.getElementById('lightbox-close');

    function loadPhotos() {
        galleryEl.innerHTML = '';
        photoIDs.forEach(id => {
            const card = document.createElement('div');
            card.className = 'gallery__card animate-on-scroll';
            const url = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Воспоминание';
            img.loading = 'lazy'; 
            card.appendChild(img);
            galleryEl.appendChild(card);
        });
    }

    galleryEl.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) {
            lightboxImageEl.src = img.src;
            lightboxEl.classList.add('is-visible');
            document.body.classList.add('no-scroll');
        }
    });

    const closeLightbox = () => {
        lightboxEl.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
    };
    lightboxCloseEl.addEventListener('click', closeLightbox);
    lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });
    loadPhotos();

    // ===== 3. SCROLL & DECORATIVE ANIMATIONS =====
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => observer.observe(element));
    
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}vw`;
            p.style.width = `${Math.random() * 3 + 1}px`;
            p.style.height = p.style.width;
            p.style.animationDelay = `${Math.random() * 25}s`;
            p.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particlesContainer.appendChild(p);
        }
    }

    // ===== 4. EASTER EGGS LOGIC =====
    // Heart Message Easter Egg
    const mainLottieHeart = document.getElementById('lottie-heart'); // Target the Lottie player
    const heartMessageEl = document.getElementById('heart-message');
    let messageTimeout;

    if (mainLottieHeart && heartMessageEl) {
        mainLottieHeart.addEventListener('click', () => {
            clearTimeout(messageTimeout); // Clear any existing timeout
            heartMessageEl.textContent = heartClickMessage;
            heartMessageEl.style.animation = 'none'; // Reset animation
            heartMessageEl.offsetHeight; // Trigger reflow
            heartMessageEl.style.animation = 'heart-message-show 2s forwards'; // Start animation
            
            messageTimeout = setTimeout(() => {
                heartMessageEl.style.animation = 'none'; // Ensure it's off if needed
                heartMessageEl.style.opacity = '0';
            }, 2000); // Disappear after 2 seconds
        });
    }

    // Audio Fragment Easter Egg
    const audioTrigger = document.getElementById('audio-trigger');
    const easterEggAudio = document.getElementById('easter-egg-audio');
    
    // Set the audio source from config
    if (easterEggAudio) {
        easterEggAudio.src = audioFileUrl;
    }

    if (audioTrigger && easterEggAudio) {
        audioTrigger.addEventListener('click', () => {
            if (easterEggAudio.paused) {
                easterEggAudio.play().catch(e => console.error("Error playing audio:", e));
                audioTrigger.style.opacity = '1';
                setTimeout(() => { audioTrigger.style.opacity = '1'; }, 3000);
            } else {
                easterEggAudio.play();
                easterEggAudio.currentTime = 0;
            }
        });
    }

});

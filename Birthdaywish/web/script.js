document.addEventListener('DOMContentLoaded', () => {
    const openGiftBtn = document.getElementById('openGift');
    const surpriseSection = document.getElementById('surprise');
    const typingText = document.getElementById('typing');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    const message = "> MISSION PASSED! Hope your new level brings you endless happiness, good health, and success in every quest you take! Happy Birthday!";
    let index = 0;
    let isTypingStarted = false;
    let clickCount = 0;

    // --- SISTEM BUNYI 8-BIT GAME ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playTone(freq, type, duration) {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function playJumpSound() {
        playTone(300, 'square', 0.1);
        setTimeout(() => playTone(600, 'square', 0.15), 50);
    }

    function playWinSound() {
        playTone(400, 'square', 0.1);
        setTimeout(() => playTone(500, 'square', 0.1), 100);
        setTimeout(() => playTone(600, 'square', 0.1), 200);
        setTimeout(() => playTone(800, 'square', 0.4), 300);
    }

    function playSelectSound() {
        playTone(700, 'square', 0.08);
    }

    function playOpenModalSound() {
        playTone(523, 'square', 0.1);
        setTimeout(() => playTone(659, 'square', 0.15), 80);
    }

    // --- LOGIK BUTANG LARI ---
    function typeEffect() {
        if (index < message.length) {
            typingText.innerHTML += message.charAt(index);
            index++;
            setTimeout(typeEffect, 35);
        }
    }

    openGiftBtn.addEventListener('click', () => {
        clickCount++;

        if (clickCount === 1) {
            playJumpSound();
            moveButtonRandomly(openGiftBtn);
            openGiftBtn.innerHTML = "⚡ EHH LARI! TEKAN LAGI!";
            openGiftBtn.style.backgroundColor = "#ffe600";
            openGiftBtn.style.color = "#000";
            return;
        }

        if (clickCount === 2) {
            playJumpSound();
            moveButtonRandomly(openGiftBtn);
            openGiftBtn.innerHTML = "🔥 LAJU SANGAT! LAST ONES!";
            openGiftBtn.style.backgroundColor = "#ff2a74";
            openGiftBtn.style.color = "#fff";
            return;
        }

        if (clickCount >= 3) {
            playWinSound();
            document.body.classList.add('shake-effect');
            
            setTimeout(() => {
                document.body.classList.remove('shake-effect');
            }, 500);

            openGiftBtn.style.position = "static";
            openGiftBtn.style.transform = "none";
            openGiftBtn.innerHTML = "🎉 QUEST UNLOCKED!";
            openGiftBtn.style.backgroundColor = "#00ff66";
            openGiftBtn.style.color = "#000";
            openGiftBtn.style.pointerEvents = "none";

            surpriseSection.classList.remove('hidden');

            if (!isTypingStarted) {
                typeEffect();
                isTypingStarted = true;
            }

            triggerConfetti();

            if (bgMusic) {
                bgMusic.play().catch(() => console.log("Muzik perlukan interaksi"));
            }

            setTimeout(() => {
                surpriseSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 600);
        }
    });

    function moveButtonRandomly(btn) {
        btn.style.position = "relative";
        const randomX = (Math.random() - 0.5) * 240;
        const randomY = (Math.random() - 0.5) * 140;
        btn.style.transition = "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        btn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.9)`;
    }

    // --- LOGIK DYNAMIC GALLERY (FILTER TABS) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pixelCards = document.querySelectorAll('.pixel-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSelectSound();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            pixelCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- LOGIK INSPECTION POP-UP (MODAL) ---
    const itemModal = document.getElementById('itemModal');
    const closeModal = document.getElementById('closeModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalRarity = document.getElementById('modalRarity');
    const modalDesc = document.getElementById('modalDesc');

    pixelCards.forEach(card => {
        card.addEventListener('click', () => {
            playOpenModalSound();
            const imgSrc = card.querySelector('img').src;
            const title = card.getAttribute('data-title');
            const date = card.getAttribute('data-date');
            const rarity = card.getAttribute('data-rarity');
            const desc = card.getAttribute('data-desc');

            modalImg.src = imgSrc;
            modalTitle.innerText = title;
            modalDate.innerText = date;
            modalRarity.innerText = rarity;
            modalDesc.innerText = desc;

            itemModal.classList.remove('hidden');
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            playSelectSound();
            itemModal.classList.add('hidden');
        });
    }

    if (itemModal) {
        itemModal.addEventListener('click', (e) => {
            if (e.target === itemModal) {
                playSelectSound();
                itemModal.classList.add('hidden');
            }
        });
    }

    // --- CONTROL BGM ---
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                bgMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }

    // ==========================================
    // 4. SECRET VIDEO VAULT (PASSWORD LOCK SYSTEM)
    // ==========================================
    const unlockBtn = document.getElementById("unlockBtn");
    const videoPassword = document.getElementById("videoPassword");
    const errorMsg = document.getElementById("errorMsg");
    const passwordContainer = document.getElementById("passwordContainer");
    const videoContainer = document.getElementById("videoContainer");
    const vaultIcon = document.getElementById("vaultIcon");
    const secretVideo = document.getElementById("secretVideo");

    // TETAPKAN KATA LALUAN ANDA DI SINI
    const SECRET_PASSWORD = "lempang kang"; 

    if (unlockBtn) {
        unlockBtn.addEventListener("click", checkPassword);
    }
    
    if (videoPassword) {
        videoPassword.addEventListener("keypress", (e) => {
            if (e.key === "Enter") checkPassword();
        });
    }

    function checkPassword() {
        if (!videoPassword) return;
        const inputVal = videoPassword.value.trim();

        if (inputVal === SECRET_PASSWORD) {
            playWinSound();

            // Animasi Mangga Buka
            if (vaultIcon) {
                vaultIcon.className = "fas fa-lock-open lock-icon unlocked-animation";
            }
            if (errorMsg) {
                errorMsg.classList.add("hidden");
            }

            // Sorokkan input password dan tunjukkan video
            if (passwordContainer) {
                passwordContainer.style.display = "none";
            }
            if (videoContainer) {
                videoContainer.classList.remove("hidden");
            }

            // Mainkan video automatik
            if (secretVideo) {
                secretVideo.play().catch(() => console.log("Video perlukan interaksi pengguna"));
            }

            // Tembakkan konfeti kejayaan
            triggerConfetti();
        } else {
            playTone(150, 'sawtooth', 0.2); // Sound ralat 8-bit
            if (errorMsg) {
                errorMsg.classList.remove("hidden");
            }
            if (passwordContainer) {
                passwordContainer.classList.add("shake-animation");

                setTimeout(() => {
                    passwordContainer.classList.remove("shake-animation");
                }, 400);
            }
        }
    }

    // Helper Function untuk Confetti
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 180,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#00ff66', '#ff2a74', '#ffe600', '#ffffff']
            });
        }
    }
});
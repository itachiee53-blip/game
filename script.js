const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get('story');
const currentStory = typeof allStories !== 'undefined' ? allStories[storyId] : null;

const iconEl = document.getElementById('scene-icon');
const audioEl = document.getElementById('scene-audio');
const sfxEl = document.getElementById('sfx-audio');
const storyText = document.getElementById('story-text');
const choicesArea = document.getElementById('choices-area');
const modal = document.getElementById('translation-modal');
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const homeBtn = document.getElementById('home-btn');

function playClick() {
    if(sfxEl) { sfxEl.src = "sounds/click.mp3"; sfxEl.play().catch(() => {}); }
}

function goHome() {
    playClick();
    // ลดเวลาหน่วงเหลือ 100ms
    setTimeout(() => { window.location.href = 'index.html'; }, 100);
}

if (homeBtn) homeBtn.onclick = goHome;

if (!currentStory) {
    window.location.href = 'index.html';
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        playClick();
        startOverlay.style.display = 'none';
        if(audioEl) audioEl.play().catch(() => {});
        loadScene(currentStory.startNode);
    });
}

function loadScene(sceneId) {
    const scene = currentStory.scenes[sceneId];
    window.currentSceneData = scene; 

    storyText.innerText = scene.text;
    if (scene.icon) iconEl.innerText = scene.icon; else iconEl.innerText = "❓";

    if (scene.sound && scene.sound !== "") {
        audioEl.src = scene.sound;
        audioEl.loop = false;
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.log("Audio failed:", e));
    } else {
        audioEl.pause();
    }

    choicesArea.innerHTML = '';
    
    if (scene.choices && scene.choices.length > 0) {
        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerHTML = `➤ ${choice.text}`; 
            btn.className = 'choice-btn';
            btn.onclick = () => { playClick(); handleChoice(choice); };
            choicesArea.appendChild(btn);
        });
    } else {
        const translateBtn = document.createElement('button');
        translateBtn.innerHTML = "📜 Translate / เฉลยฉากจบ";
        translateBtn.className = 'choice-btn';
        translateBtn.style.backgroundColor = '#f39c12';
        translateBtn.onclick = () => { playClick(); showEndingTranslation(); };
        choicesArea.appendChild(translateBtn);

        const endBtn = document.createElement('button');
        endBtn.innerText = "🏆 End of Story - Back to Menu";
        endBtn.className = 'choice-btn';
        endBtn.style.backgroundColor = '#2ecc71';
        endBtn.onclick = goHome; 
        choicesArea.appendChild(endBtn);
    }
}

function handleChoice(choice) {
    const scene = window.currentSceneData;
    document.getElementById('m-story-en').innerText = scene.text;
    document.getElementById('m-story-read').innerText = scene.phonetic || "-";
    document.getElementById('m-story-th').innerText = scene.th;

    document.querySelector('.review-box:nth-child(3)').style.display = 'block'; 
    document.getElementById('m-choice-en').innerText = choice.text;
    document.getElementById('m-choice-read').innerText = choice.phonetic || "-";
    document.getElementById('m-choice-th').innerText = choice.th;

    const nextBtn = document.getElementById('modal-next-btn');
    nextBtn.innerText = "Next Scene ➜";
    // ลดเวลาหน่วงตอนเปลี่ยนฉากเหลือ 150ms (จากเดิม 300)
    nextBtn.onclick = () => { playClick(); closeModal(); setTimeout(() => loadScene(choice.nextId), 150); };
    openModal();
}

function showEndingTranslation() {
    const scene = window.currentSceneData;
    document.getElementById('m-story-en').innerText = scene.text;
    document.getElementById('m-story-read').innerText = scene.phonetic || "-";
    document.getElementById('m-story-th').innerText = scene.th;
    document.querySelector('.review-box:nth-child(3)').style.display = 'none';

    const nextBtn = document.getElementById('modal-next-btn');
    nextBtn.innerText = "Close ✖";
    nextBtn.onclick = () => { playClick(); closeModal(); };
    openModal();
}

function openModal() { modal.classList.remove('hidden'); setTimeout(() => modal.classList.add('show'), 10); }
function closeModal() { modal.classList.remove('show'); setTimeout(() => modal.classList.add('hidden'), 150); }
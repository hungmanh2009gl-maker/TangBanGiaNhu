/* =====================================================
   ✏️  CHỈNH SỬA PHẦN NÀY CHO PHÙ HỢP VỚI BẠN
   ===================================================== */
const CONFIG = {
  crushName: "Gia Như",        // Tên crush (hiện ở tiêu đề)
  senderName: "Mãnh",          // Tên bạn (ký cuối thư)
  photoCaption: "Chúc mừng 20/10 💗", // Dòng chữ dưới ảnh

  // Nội dung bức thư: mỗi phần tử là 1 đoạn
  letter: [
    "Chúc mừng ngày Phụ nữ Việt Nam 20/10 nhé! 🌸",
    "Mình không biết nói sao cho hay, nhưng mỗi lần thấy bạn cười, ngày hôm đó của mình bỗng trở nên đáng nhớ hơn hẳn.",
    "Mong bạn luôn xinh đẹp, thật vui và được yêu thương thật nhiều, không chỉ hôm nay mà mọi ngày.",
    "Và nếu có thể, mình mong mình sẽ là một trong những lý do khiến bạn mỉm cười. 💗",
  ],

  typingSpeed: 45, // ms cho mỗi chữ (nhỏ hơn = nhanh hơn)
};

/* =====================================================
   PHẦN CODE – thường không cần sửa
   ===================================================== */
const $ = (id) => document.getElementById(id);

const sceneStart  = $("scene-start");
const scenePhoto  = $("scene-photo");
const sceneLetter = $("scene-letter");
const music       = $("bg-music");
const musicBtn    = $("music-toggle");

function showScene(scene) {
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
  scene.classList.add("active");
}

/* --- Tim bay nền --- */
const heartEmojis = ["💗", "💖", "💕", "🌸", "💓"];
function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  h.style.animationDuration = 6 + Math.random() * 6 + "s";
  $("hearts").appendChild(h);
  setTimeout(() => h.remove(), 12500);
}
setInterval(spawnHeart, 600);

/* --- Ảnh dự phòng nếu chưa có file ảnh --- */
const photo = $("crush-photo");
photo.addEventListener("error", () => {
  photo.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'>
         <rect width='100%' height='100%' fill='#ffe4ec'/>
         <text x='50%' y='45%' font-size='90' text-anchor='middle'>💗</text>
         <text x='50%' y='62%' font-size='20' fill='#f0628f' text-anchor='middle' font-family='sans-serif'>Hãy thêm ảnh vào images/crush.jpg</text>
       </svg>`
    );
});

/* --- Cảnh 1 → 2 --- */
$("btn-start").addEventListener("click", () => {
  music.volume = 0.6;
  music.play().then(() => musicBtn.classList.remove("hidden")).catch(() => {
    // Không có file nhạc hoặc bị chặn: vẫn hiện nút để thử lại
    musicBtn.classList.remove("hidden");
    musicBtn.classList.add("paused");
  });

  $("title-hello").textContent = `Gửi ${CONFIG.crushName} 🌷`;
  $("photo-caption").textContent = CONFIG.photoCaption;
  showScene(scenePhoto);

  // Hiện nút sang bức thư sau khi ảnh đã xuất hiện
  setTimeout(() => $("btn-next").classList.remove("hidden"), 3800);
});

/* --- Cảnh 2 → 3 --- */
$("btn-next").addEventListener("click", () => showScene(sceneLetter));

/* --- Mở phong thư --- */
let opened = false;
$("envelope").addEventListener("click", () => {
  if (opened) return;
  opened = true;
  $("envelope").classList.add("open");
  $("hint").style.display = "none";

  setTimeout(() => $("envelope-wrap").classList.add("gone"), 1700);
  setTimeout(() => {
    $("letter-card").classList.add("show");
    setTimeout(typeLetter, 900);
  }, 2100);
});

/* --- Hiệu ứng gõ chữ --- */
async function typeLetter() {
  const box = $("letter-text");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  box.appendChild(cursor);

  for (const para of CONFIG.letter) {
    for (const ch of para) {
      cursor.before(document.createTextNode(ch));
      await sleep(CONFIG.typingSpeed);
    }
    cursor.before(document.createTextNode("\n\n"));
    await sleep(500);
  }
  cursor.remove();

  const sig = $("signature");
  sig.textContent = `— ${CONFIG.senderName} 💌`;
  sig.classList.remove("hidden");
  heartBurst();
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- Tim bùng nổ --- */
function heartBurst() {
  for (let i = 0; i < 28; i++) {
    const b = document.createElement("span");
    b.className = "burst";
    b.textContent = heartEmojis[i % heartEmojis.length];
    b.style.left = "50vw";
    b.style.top = "50vh";
    b.style.fontSize = 18 + Math.random() * 18 + "px";
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 220;
    b.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    b.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1700);
  }
}

/* --- Bật / tắt nhạc --- */
musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.classList.remove("paused");
  } else {
    music.pause();
    musicBtn.classList.add("paused");
  }
});

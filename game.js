
"use strict";

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const chapters = [
  {
    title: "ГЛАВА 01 · НАЧАЛО",
    text: "Санкт-Петербург. Поздний вечер. Два человека ещё не знают, что скоро познакомятся."
  },
  {
    title: "ГЛАВА 01 · ДОМ АНИ",
    text: "Канал Грибоедова, 168. Пятый этаж. Аня сидит дома, немного скучает и открывает сайт знакомств."
  },
  {
    title: "ГЛАВА 01 · ДОМ САШИ",
    text: "Проспект Кузнецова, 17. Саша находится у себя дома на пятом этаже. Он тоже решает посмотреть анкеты."
  },
  {
    title: "ГЛАВА 01 · СОВПАДЕНИЕ",
    text: "Два человека. Два телефона. Два экрана постепенно приближаются к одной и той же анкете."
  },
  {
    title: "ГЛАВА 01 · ПЕРВАЯ ВСТРЕЧА",
    text: "Аня останавливается на анкете Саши. Впереди полтора месяца переписки, после которых они наконец встретятся."
  }
];

let currentChapter = 0;
let gameScene;

class StoryScene extends Phaser.Scene {
  constructor() {
    super("StoryScene");
  }

  preload() {
    this.load.image("intro", "assets/intro-scene.png");
  }

  create() {
    gameScene = this;

    this.cameras.main.setBackgroundColor("#151a2b");

    if (this.textures.exists("intro")) {
      this.art = this.add.image(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        "intro"
      );

      this.art.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
      this.art.setOrigin(0.5);

      this.tweens.add({
        targets: this.art,
        scaleX: this.art.scaleX * 1.035,
        scaleY: this.art.scaleY * 1.035,
        duration: 12000,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1
      });
    } else {
      this.add.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        "НЕ УДАЛОСЬ ЗАГРУЗИТЬ ГРАФИКУ",
        {
          fontFamily: "monospace",
          fontSize: "22px",
          color: "#ffffff"
        }
      ).setOrigin(0.5);
    }

    this.add.rectangle(
      GAME_WIDTH / 2,
      28,
      GAME_WIDTH,
      56,
      0x111522,
      0.55
    );

    this.locationText = this.add.text(
      25,
      19,
      "САНКТ-ПЕТЕРБУРГ · НАША ИСТОРИЯ",
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffe0bb"
      }
    );

    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 19,
      GAME_WIDTH,
      38,
      0x111522,
      0.65
    );

    this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 19,
      "ГЛАВА 01 · ПОЛТОРА МЕСЯЦА ДО ВСТРЕЧИ",
      {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#f5d6bd"
      }
    ).setOrigin(0.5);

    this.updateArtwork();
  }

  updateArtwork() {
    if (!this.art) return;

    this.art.setAlpha(1);
  }
}

const config = {
  type: Phaser.AUTO,

  parent: "game",

  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  backgroundColor: "#151a2b",

  pixelArt: true,
  roundPixels: true,
  antialias: false,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },

  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true
  },

  scene: [StoryScene]
};

const game = new Phaser.Game(config);

function updateStory() {
  const chapter = chapters[currentChapter];

  document.getElementById("chapter").textContent =
    chapter.title;

  document.getElementById("story").textContent =
    chapter.text;

  document.getElementById("counter").textContent =
    String(currentChapter + 1).padStart(2, "0") +
    " / " +
    String(chapters.length).padStart(2, "0");

  document.getElementById("prev").disabled =
    currentChapter === 0;

  document.getElementById("next").textContent =
    currentChapter === chapters.length - 1
      ? "СНАЧАЛА ↻"
      : "ДАЛЕЕ →";
}

function nextChapter() {
  currentChapter =
    currentChapter === chapters.length - 1
      ? 0
      : currentChapter + 1;

  updateStory();
}

function previousChapter() {
  if (currentChapter > 0) {
    currentChapter--;
    updateStory();
  }
}

document.getElementById("next").addEventListener(
  "click",
  nextChapter
);

document.getElementById("prev").addEventListener(
  "click",
  previousChapter
);

document.addEventListener("keydown", event => {
  if (
    event.key === "Enter" ||
    event.key === "ArrowRight"
  ) {
    nextChapter();
  }

  if (event.key === "ArrowLeft") {
    previousChapter();
  }
});

updateStory();

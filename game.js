"use strict";

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const chapters = [
  {
    name: "Два одиноких вечера",
    place: "Квартира Саши",
    description: [
      "Санкт-Петербург. Поздний вечер.",
      "В двух разных частях города горят окна двух квартир.",
      "Аня живёт на набережной канала Грибоедова, 168.",
      "Саша — на проспекте Кузнецова, 17.",
      "Оба проводят вечер каждый по-своему. И пока не знают друг о друге."
    ],
    object: "computer",
    prompt: "Посмотреть анкеты",
    next: "chat"
  },
  {
    name: "Полтора месяца",
    place: "Переписка",
    description: [
      "Они познакомились на сайте знакомств.",
      "Началась переписка. Сначала осторожная, потом всё более близкая.",
      "Прошло около полутора месяцев.",
      "Однажды Аня написала:",
      "«Я уже замуж выйду пока мы встретимся».",
      "После этого они наконец договорились о встрече."
    ],
    object: "phone",
    prompt: "Открыть сообщение",
    next: "pub"
  },
  {
    name: "Первая встреча",
    place: "Blackwood, Невский проспект",
    description: [
      "Они встретились в ирландском баре Blackwood на Невском.",
      "Аня заказала виски с колой.",
      "Саша — пиво.",
      "Волнение постепенно сменилось обычным разговором.",
      "Вечер только начинался."
    ],
    object: "table",
    prompt: "Продолжить вечер",
    next: "secondBar"
  },
  {
    name: "Ещё один бар",
    place: "Вечер в Петербурге",
    description: [
      "Аня предложила пойти в другой бар.",
      "Название этого места уже не сохранилось в памяти.",
      "Они продолжили вечер вдвоём.",
      "А потом Саша предложил поиграть на гитаре — ведь у Ани была гитара."
    ],
    object: "door",
    prompt: "Поехать к Ане",
    next: "anyaHome"
  },
  {
    name: "Первый поцелуй",
    place: "Квартира Ани",
    description: [
      "По дороге они зашли в магазин.",
      "Купили виски и колу.",
      "Дома было уютно и романтично.",
      "Они сидели, разговаривали и смеялись.",
      "Потом легли в одну постель.",
      "И начали целоваться."
    ],
    object: "guitar",
    prompt: "Вспомнить тот вечер",
    next: "together"
  },
  {
    name: "Маленькие моменты",
    place: "Вместе",
    description: [
      "После первой встречи Саша приезжал к Ане.",
      "Они проводили время вместе.",
      "Появлялись свои привычки, шутки и маленькие воспоминания.",
      "Их история постепенно становилась чем-то большим."
    ],
    object: "photo",
    prompt: "Посмотреть воспоминания",
    next: "cottage"
  },
  {
    name: "Я люблю тебя",
    place: "Коттедж, вечер",
    description: [
      "Примерно через полтора месяца Саша уехал отдыхать в коттеджные дома.",
      "Вечером он сидел на веранде.",
      "Аня была дома. Они разговаривали по видеосвязи.",
      "И в какой-то момент Саша сказал:",
      "«Я люблю тебя».",
      "Наступило романтическое молчание."
    ],
    object: "phone",
    prompt: "Завершить звонок",
    next: "flowers"
  },
  {
    name: "Цветы",
    place: "Дом Саши",
    description: [
      "На следующий день Саша встретил Аню у себя дома.",
      "Он был с цветами.",
      "Вчерашние слова уже нельзя было забрать обратно.",
      "А впереди был ещё один важный день."
    ],
    object: "flowers",
    prompt: "Пойти к Ане",
    next: "mayFirst"
  },
  {
    name: "Первое мая",
    place: "Квартира Ани",
    description: [
      "На следующий день они приехали к Ане.",
      "Сидели в ванной и разговаривали.",
      "Обсуждали, почему они до сих пор не встречаются.",
      "И тогда Саша предложил:",
      "«Давай встречаться».",
      "Так началась новая глава их истории."
    ],
    object: "bath",
    prompt: "Прочитать финальные слова",
    next: "ending"
  },
  {
    name: "Продолжение следует",
    place: "Ваша история",
    description: [
      "Это было только начало.",
      "Впереди были совместные дни, поездки, праздники, радость и непростые моменты.",
      "У этой истории гораздо больше глав.",
      "И мы обязательно продолжим её."
    ],
    object: "memory",
    prompt: "Начать историю сначала",
    next: "restart"
  }
];

class StoryGame extends Phaser.Scene {
  constructor() {
    super("StoryGame");
    this.chapterIndex = 0;
    this.dialogue = null;
    this.dialogueIndex = 0;
    this.nearObject = null;
    this.moving = false;
    this.touchDirection = { up: false, down: false, left: false, right: false };
    this.solids = [];
  }

  create() {
    this.createTextures();

    this.keys = this.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
      up2: "UP",
      down2: "DOWN",
      left2: "LEFT",
      right2: "RIGHT",
      action: "E",
      space: "SPACE",
      enter: "ENTER"
    });

    this.worldLayer = this.add.container(0, 0);
    this.uiLayer = this.add.container(0, 0);

    this.player = this.add.sprite(480, 390, "hero-down");
    this.player.setDepth(20);
    this.worldLayer.add(this.player);

    this.createDialogueUI();
    this.createPromptUI();
    this.createMobileControls();

    this.input.keyboard.on("keydown-E", () => this.interact());
    this.input.keyboard.on("keydown-SPACE", () => this.interact());
    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.dialogue) this.advanceDialogue();
    });

    this.loadChapter(0);
  }

  createTextures() {
    const make = (key, width, height, draw) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      draw(g);
      g.generateTexture(key, width, height);
      g.destroy();
    };

    // Персонажи рисуются из отдельных пиксельных блоков.
    const hero = (key, shirt, hair, direction) => {
      make(key, 24, 32, g => {
        g.fillStyle(0x17141b);
        g.fillRect(6, 2, 12, 9);
        g.fillStyle(0xe5b38f);
        g.fillRect(7, 5, 10, 9);
        g.fillStyle(hair);
        g.fillRect(6, 2, 12, 5);
        g.fillRect(5, 5, 3, 5);
        g.fillRect(16, 5, 3, 5);

        if (direction !== "up") {
          g.fillStyle(0x29212a);
          g.fillRect(9, 10, 2, 2);
          g.fillRect(14, 10, 2, 2);
        }

        g.fillStyle(shirt);
        g.fillRect(5, 15, 14, 10);
        g.fillRect(3, 17, 3, 8);
        g.fillRect(18, 17, 3, 8);
        g.fillStyle(0x25212b);
        g.fillRect(6, 25, 5, 6);
        g.fillRect(13, 25, 5, 6);
        g.fillStyle(0x17141b);
        g.fillRect(5, 30, 7, 2);
        g.fillRect(12, 30, 7, 2);

        if (direction === "up") {
          g.fillStyle(hair);
          g.fillRect(5, 2, 14, 12);
        }
      });
    };

    hero("hero-down", 0x526d83, 0x382a27, "down");
    hero("hero-up", 0x526d83, 0x382a27, "up");
    hero("hero-side", 0x526d83, 0x382a27, "side");

    make("anya", 24, 32, g => {
      g.fillStyle(0x251d25);
      g.fillRect(4, 2, 16, 13);
      g.fillStyle(0xf0c3a6);
      g.fillRect(7, 5, 10, 10);
      g.fillStyle(0x4a2d2b);
      g.fillRect(5, 2, 14, 5);
      g.fillRect(4, 6, 4, 10);
      g.fillRect(16, 6, 4, 10);
      g.fillStyle(0x34212a);
      g.fillRect(9, 10, 2, 2);
      g.fillRect(14, 10, 2, 2);
      g.fillStyle(0xb56d79);
      g.fillRect(5, 15, 14, 10);
      g.fillStyle(0x29212a);
      g.fillRect(6, 25, 5, 6);
      g.fillRect(13, 25, 5, 6);
    });

    make("floor", 32, 32, g => {
      g.fillStyle(0x59483f);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x665348);
      g.fillRect(1, 1, 14, 14);
      g.fillRect(17, 17, 14, 14);
      g.fillStyle(0x493b36);
      g.fillRect(15, 0, 2, 32);
      g.fillRect(0, 15, 32, 2);
      g.fillStyle(0x796253);
      g.fillRect(4, 5, 2, 1);
      g.fillRect(23, 24, 2, 1);
    });

    make("wall", 32, 32, g => {
      g.fillStyle(0x34313c);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x45404a);
      g.fillRect(1, 1, 30, 13);
      g.fillStyle(0x282630);
      g.fillRect(0, 15, 32, 2);
      g.fillStyle(0x554d55);
      g.fillRect(3, 5, 8, 1);
      g.fillRect(20, 9, 7, 1);
    });

    make("rug", 96, 64, g => {
      g.fillStyle(0x754b56);
      g.fillRect(0, 0, 96, 64);
      g.fillStyle(0xa36b70);
      g.fillRect(4, 4, 88, 56);
      g.fillStyle(0x754b56);
      g.fillRect(10, 10, 76, 44);
      g.fillStyle(0xd0a17e);
      g.fillRect(15, 15, 66, 34);
      g.fillStyle(0x754b56);
      g.fillRect(21, 21, 54, 22);
    });

    make("bed", 128, 80, g => {
      g.fillStyle(0x302a31);
      g.fillRect(4, 5, 120, 70);
      g.fillStyle(0x795b54);
      g.fillRect(8, 9, 112, 62);
      g.fillStyle(0xd3c6b6);
      g.fillRect(13, 13, 102, 52);
      g.fillStyle(0x8c6475);
      g.fillRect(13, 13, 102, 20);
      g.fillStyle(0xe2d6c7);
      g.fillRect(20, 39, 38, 20);
      g.fillRect(66, 39, 40, 20);
    });

    make("desk", 80, 48, g => {
      g.fillStyle(0x30232a);
      g.fillRect(3, 4, 74, 40);
      g.fillStyle(0x8a5c43);
      g.fillRect(5, 5, 70, 28);
      g.fillStyle(0x312c3b);
      g.fillRect(25, 8, 30, 19);
      g.fillStyle(0x7d9eae);
      g.fillRect(28, 11, 24, 13);
      g.fillStyle(0xe0b68a);
      g.fillRect(9, 9, 9, 6);
      g.fillStyle(0x49342e);
      g.fillRect(8, 34, 5, 10);
      g.fillRect(67, 34, 5, 10);
    });

    make("guitar", 32, 48, g => {
      g.fillStyle(0xb7784b);
      g.fillRect(10, 17, 13, 21);
      g.fillRect(13, 4, 7, 18);
      g.fillStyle(0x593a30);
      g.fillRect(14, 0, 5, 19);
      g.fillStyle(0x302630);
      g.fillRect(14, 24, 5, 5);
      g.fillStyle(0xe3c9a1);
      g.fillRect(16, 2, 1, 32);
    });

    make("table", 64, 48, g => {
      g.fillStyle(0x30252c);
      g.fillRect(5, 8, 54, 34);
      g.fillStyle(0x956044);
      g.fillRect(7, 4, 50, 28);
      g.fillStyle(0xc8a17b);
      g.fillRect(10, 7, 44, 21);
      g.fillStyle(0x593a30);
      g.fillRect(11, 32, 5, 12);
      g.fillRect(48, 32, 5, 12);
    });

    make("phone", 24, 36, g => {
      g.fillStyle(0x171821);
      g.fillRect(3, 0, 18, 34);
      g.fillStyle(0x8eb5bb);
      g.fillRect(5, 3, 14, 27);
      g.fillStyle(0xe4c3a4);
      g.fillRect(9, 7, 6, 6);
      g.fillStyle(0x9a6d85);
      g.fillRect(8, 17, 8, 2);
      g.fillRect(8, 21, 6, 2);
    });

    make("flowers", 32, 40, g => {
      g.fillStyle(0x47724d);
      g.fillRect(14, 15, 3, 22);
      g.fillRect(17, 24, 8, 3);
      g.fillStyle(0xd99bb1);
      g.fillRect(8, 4, 8, 8);
      g.fillRect(17, 3, 8, 8);
      g.fillRect(12, 0, 8, 8);
      g.fillStyle(0xe8c78b);
      g.fillRect(14, 6, 5, 5);
      g.fillStyle(0x795342);
      g.fillRect(10, 35, 14, 4);
    });

    make("window", 96, 80, g => {
      g.fillStyle(0x262533);
      g.fillRect(0, 0, 96, 80);
      g.fillStyle(0x25394f);
      g.fillRect(5, 5, 86, 70);
      g.fillStyle(0x526f83);
      g.fillRect(8, 8, 80, 64);
      g.fillStyle(0x1d2638);
      g.fillRect(12, 12, 72, 60);
      g.fillStyle(0xf3d39b);
      g.fillRect(20, 20, 4, 4);
      g.fillRect(58, 31, 5, 4);
      g.fillRect(40, 51, 4, 4);
      g.fillStyle(0x75616a);
      g.fillRect(46, 5, 4, 70);
      g.fillRect(5, 38, 86, 4);
    });

    make("door", 48, 72, g => {
      g.fillStyle(0x28212a);
      g.fillRect(0, 0, 48, 72);
      g.fillStyle(0x80563e);
      g.fillRect(5, 4, 38, 68);
      g.fillStyle(0x9d704c);
      g.fillRect(9, 8, 30, 58);
      g.fillStyle(0xe0b778);
      g.fillRect(34, 36, 4, 4);
    });

    make("bath", 96, 48, g => {
      g.fillStyle(0x343c48);
      g.fillRect(0, 0, 96, 48);
      g.fillStyle(0xd6d5d0);
      g.fillRect(4, 8, 88, 34);
      g.fillStyle(0x8db5bd);
      g.fillRect(9, 13, 78, 24);
      g.fillStyle(0xf0e9dd);
      g.fillRect(14, 17, 68, 16);
    });

    make("photo", 40, 48, g => {
      g.fillStyle(0x4a332d);
      g.fillRect(0, 0, 40, 48);
      g.fillStyle(0xd6bd99);
      g.fillRect(4, 4, 32, 40);
      g.fillStyle(0x6d8591);
      g.fillRect(7, 7, 26, 22);
      g.fillStyle(0xe2b995);
      g.fillRect(12, 12, 7, 9);
      g.fillRect(21, 12, 7, 9);
      g.fillStyle(0x82916e);
      g.fillRect(7, 26, 26, 5);
    });
  }

  createDialogueUI() {
    this.dialogueBox = this.add.graphics().setDepth(100);
    this.dialogueName = this.add.text(35, 407, "", {
      fontFamily: "Arial",
      fontSize: "17px",
      color: "#e9bd91",
      fontStyle: "bold"
    }).setDepth(101);

    this.dialogueText = this.add.text(35, 435, "", {
      fontFamily: "Arial",
      fontSize: "19px",
      color: "#f7f0e5",
      lineSpacing: 8,
      wordWrap: { width: 870 }
    }).setDepth(101);

    this.dialogueHint = this.add.text(915, 510, "E / ПРОБЕЛ  ›", {
      fontFamily: "Arial",
      fontSize: "13px",
      color: "#d5b9a2"
    }).setOrigin(1).setDepth(101);

    this.hideDialogue();
  }

  createPromptUI() {
    this.prompt = this.add.text(480, 320, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#252332",
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setDepth(80);
    this.prompt.setVisible(false);
  }

  createMobileControls() {
    document.querySelectorAll("[data-dir]").forEach(button => {
      const dir = button.dataset.dir;
      const start = event => {
        event.preventDefault();
        this.touchDirection[dir] = true;
      };
      const stop = event => {
        event.preventDefault();
        this.touchDirection[dir] = false;
      };
      button.addEventListener("pointerdown", start);
      button.addEventListener("pointerup", stop);
      button.addEventListener("pointerleave", stop);
      button.addEventListener("pointercancel", stop);
    });

    const action = document.getElementById("action-button");
    action.addEventListener("pointerdown", event => {
      event.preventDefault();
      this.interact();
    });
  }

  loadChapter(index) {
    this.chapterIndex = index;
    this.dialogue = null;
    this.nearObject = null;
    this.prompt.setVisible(false);
    this.hideDialogue();

    const chapter = chapters[index];
    document.getElementById("chapter-name").textContent =
      `Глава ${index + 1} · ${chapter.name}`;

    this.worldLayer.removeAll(true);
    this.solids = [];

    this.drawRoom(index);
    this.player = this.add.sprite(480, 390, "hero-down").setDepth(20);
    this.worldLayer.add(this.player);

    this.openDialogue(chapter.description, "История");
  }

  drawRoom(index) {
    const g = this.add.graphics();
    this.worldLayer.add(g);

    const dark = index === 0 || index === 1 || index === 6;
    g.fillStyle(dark ? 0x18202d : 0x29242c);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Пол.
    for (let y = 55; y < 510; y += 32) {
      for (let x = 0; x < GAME_WIDTH; x += 32) {
        this.addWorldImage(x + 16, y + 16, "floor");
      }
    }

    // Стены и нижняя панель.
    g.fillStyle(0x282630);
    g.fillRect(0, 0, 960, 58);
    g.fillStyle(0x4a3b3c);
    g.fillRect(0, 58, 960, 7);
    g.fillStyle(0x171923);
    g.fillRect(0, 510, 960, 30);

    for (let x = 0; x < 960; x += 32) {
      this.addWorldImage(x + 16, 28, "wall");
    }

    // Декорации и предметы конкретной главы.
    if (index === 0) {
      this.addWorldImage(480, 115, "window");
      this.addWorldImage(250, 225, "bed");
      this.addWorldImage(690, 190, "desk");
      this.addWorldImage(690, 160, "photo");
      this.addObject(690, 205, "computer", "desk", "Посмотреть анкеты");
      this.addObject(480, 115, "window", "window", "Посмотреть на город");
      this.addObject(250, 225, "bed", "bed", "Осмотреть комнату");
    }

    if (index === 1) {
      this.addWorldImage(480, 135, "window");
      this.addWorldImage(450, 260, "table");
      this.addWorldImage(700, 210, "phone");
      this.addObject(700, 210, "phone", "phone", "Открыть переписку");
      this.addObject(450, 260, "table", "table", "Вспомнить первые сообщения");
    }

    if (index === 2 || index === 3) {
      this.addWorldImage(480, 140, "window");
      this.addWorldImage(480, 300, "table");
      this.addWorldImage(260, 260, "table");
      this.addWorldImage(700, 260, "table");
      this.addObject(480, 300, "table", "table", "Продолжить вечер");
      this.addObject(870, 260, "door", "door", "Выйти из бара");
    }

    if (index === 4) {
      this.addWorldImage(480, 115, "window");
      this.addWorldImage(230, 230, "bed");
      this.addWorldImage(700, 180, "desk");
      this.addWorldImage(770, 290, "guitar");
      this.addObject(770, 290, "guitar", "guitar", "Взять гитару");
      this.addObject(230, 230, "bed", "bed", "Вспомнить тот вечер");
    }

    if (index === 5) {
      this.addWorldImage(480, 120, "window");
      this.addWorldImage(230, 230, "bed");
      this.addWorldImage(700, 220, "photo");
      this.addWorldImage(480, 300, "table");
      this.addObject(700, 220, "photo", "photo", "Посмотреть фотографию");
      this.addObject(480, 300, "table", "table", "Вспомнить совместные вечера");
    }

    if (index === 6) {
      this.addWorldImage(480, 120, "window");
      this.addWorldImage(480, 300, "table");
      this.addWorldImage(480, 265, "phone");
      this.addObject(480, 265, "phone", "phone", "Ответить на видеозвонок");
    }

    if (index === 7) {
      this.addWorldImage(480, 115, "window");
      this.addWorldImage(480, 300, "table");
      this.addWorldImage(480, 265, "flowers");
      this.addObject(480, 265, "flowers", "flowers", "Взять цветы");
    }

    if (index === 8) {
      this.addWorldImage(480, 280, "bath");
      this.addWorldImage(700, 150, "window");
      this.addObject(480, 280, "bath", "bath", "Поговорить с Аней");
    }

    if (index === 9) {
      this.addWorldImage(480, 160, "photo");
      this.addWorldImage(480, 300, "table");
      this.addObject(480, 160, "photo", "photo", "Перечитать историю");
    }

    // Свет и декоративные огни.
    if (dark) {
      for (let i = 0; i < 22; i++) {
        const x = 35 + ((i * 137) % 890);
        const y = 80 + ((i * 71) % 360);
        g.fillStyle(i % 3 === 0 ? 0xe9bd91 : 0x536d88, 0.5);
        g.fillRect(x, y, 3, 3);
      }
    }

    // Двери и стены как границы комнаты.
    this.solids = [
      { x: -20, y: 270, w: 40, h: 540 },
      { x: 980, y: 270, w: 40, h: 540 },
      { x: 480, y: 550, w: 960, h: 40 },
      { x: 480, y: -30, w: 960, h: 60 }
    ];
  }

  addWorldImage(x, y, key) {
    const image = this.add.image(x, y, key);
    image.setDepth(y);
    this.worldLayer.add(image);
    return image;
  }

  addObject(x, y, id, texture, label) {
    const sprite = this.add.image(x, y, texture);
    sprite.setDepth(y + 1);
    this.worldLayer.add(sprite);

    this.interactables = this.interactables || [];
    this.interactables.push({
      x, y, id, label,
      sprite,
      used: false
    });
  }

  openDialogue(lines, speaker) {
    this.dialogue = lines;
    this.dialogueIndex = 0;
    this.dialogueName.setText(speaker);
    this.dialogueBox.clear();
    this.dialogueBox.fillStyle(0x151722, 0.96);
    this.dialogueBox.fillRoundedRect(18, 390, 924, 132, 8);
    this.dialogueBox.lineStyle(2, 0x92745f, 0.9);
    this.dialogueBox.strokeRoundedRect(18, 390, 924, 132, 8);
    this.dialogueBox.setVisible(true);
    this.dialogueName.setVisible(true);
    this.dialogueText.setVisible(true);
    this.dialogueHint.setVisible(true);
    this.showDialogueLine();
  }

  showDialogueLine() {
    if (!this.dialogue) return;
    this.dialogueText.setText(this.dialogue[this.dialogueIndex]);
  }

  advanceDialogue() {
    if (!this.dialogue) return;

    this.dialogueIndex++;

    if (this.dialogueIndex >= this.dialogue.length) {
      this.hideDialogue();
      return;
    }

    this.showDialogueLine();
  }

  hideDialogue() {
    this.dialogue = null;
    this.dialogueBox.setVisible(false);
    this.dialogueName.setVisible(false);
    this.dialogueText.setVisible(false);
    this.dialogueHint.setVisible(false);
  }

  interact() {
    if (this.dialogue) {
      this.advanceDialogue();
      return;
    }

    if (!this.nearObject) return;

    const chapter = chapters[this.chapterIndex];
    const object = this.nearObject;

    if (this.chapterIndex === 9) {
      this.loadChapter(0);
      return;
    }

    this.openDialogue(
      [
        object.label + ".",
        ...chapter.description.slice(0, 2),
        "Нажми E или ПРОБЕЛ, чтобы продолжить."
      ],
      "Воспоминание"
    );

    this.time.delayedCall(100, () => {
      this.onDialogueFinished = () => {
        this.onDialogueFinished = null;
        const next = chapter.next;

        if (next === "restart") {
          this.loadChapter(0);
        } else {
          const nextIndex = chapters.findIndex(c => {
            const names = [
              "chat", "pub", "secondBar", "anyaHome",
              "together", "cottage", "flowers", "mayFirst", "ending"
            ];
            return names[this.chapterIndex] === next;
          });

          this.loadChapter(
            nextIndex >= 0 ? nextIndex : Math.min(this.chapterIndex + 1, chapters.length - 1)
          );
        }
      };
    });
  }

  update() {
    if (!this.player || this.dialogue) return;

    let dx = 0;
    let dy = 0;

    if (this.keys.left.isDown || this.keys.left2.isDown || this.touchDirection.left) dx--;
    if (this.keys.right.isDown || this.keys.right2.isDown || this.touchDirection.right) dx++;
    if (this.keys.up.isDown || this.keys.up2.isDown || this.touchDirection.up) dy--;
    if (this.keys.down.isDown || this.keys.down2.isDown || this.touchDirection.down) dy++;

    const moving = dx !== 0 || dy !== 0;
    if (moving) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;

      const speed = 155;
      const nextX = this.player.x + dx * speed * this.game.loop.delta / 1000;
      const nextY = this.player.y + dy * speed * this.game.loop.delta / 1000;

      this.player.x = Phaser.Math.Clamp(nextX, 28, 932);
      this.player.y = Phaser.Math.Clamp(nextY, 95, 490);

      if (dy < 0) this.player.setTexture("hero-up");
      else if (dy > 0) this.player.setTexture("hero-down");
      else this.player.setTexture("hero-side");

      if (dx < 0) this.player.setFlipX(true);
      else if (dx > 0) this.player.setFlipX(false);

      this.player.y += Math.sin(this.time.now / 75) * 0.25;
    }

    this.nearObject = null;
    let bestDistance = 48;

    if (this.interactables) {
      for (const object of this.interactables) {
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y, object.x, object.y
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          this.nearObject = object;
        }
      }
    }

    if (this.nearObject) {
      this.prompt.setText("E  ·  " + this.nearObject.label);
      this.prompt.setPosition(this.nearObject.x, this.nearObject.y - 55);
      this.prompt.setVisible(true);
    } else {
      this.prompt.setVisible(false);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#171923",
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [StoryGame]
};

new Phaser.Game(config);

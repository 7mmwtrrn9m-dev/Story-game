
(() => {
  "use strict";

  const W = 960;
  const H = 540;

  const lines = [
    {
      speaker: "Санкт-Петербург · поздний вечер",
      text: "В одном городе, в двух разных домах, два человека листали анкеты."
    },
    {
      speaker: "Аня · набережная канала Грибоедова",
      text: "На пятом этаже старого петербургского дома горел свет. Аня листала анкеты на телефоне."
    },
    {
      speaker: "Саша · проспект Кузнецова",
      text: "В другой части города Саша делал то же самое. Они ещё не знали друг о друге."
    },
    {
      speaker: "Два экрана · одна случайность",
      text: "Они начали переписываться. Так началась история, которая постепенно перестала быть просто перепиской."
    },
    {
      speaker: "Полтора месяца спустя",
      text: "«Я уже замуж выйду, пока мы встретимся», — написала Аня. После этого встречу наконец согласовали."
    }
  ];

  class OpeningScene extends Phaser.Scene {
    constructor() {
      super("OpeningScene");
      this.page = 0;
    }

    create() {
      this.cameras.main.setBackgroundColor("#101725");

      this.drawCity();

      this.drawApartment(0, "anya");
      this.drawApartment(480, "sasha");

      this.drawSplit();

      this.createPeople();
      this.createAtmosphere();

      this.time.addEvent({
        delay: 5200,
        loop: true,
        callback: () => this.twinkle()
      });
    }

    drawCity() {
      const g = this.add.graphics();

      g.fillGradientStyle(
        0x1a2940,
        0x1a2940,
        0x111a2b,
        0x111a2b,
        1
      );

      g.fillRect(0, 0, W, H);

      g.fillStyle(0x8c5260, 0.12);
      g.fillRect(0, 270, W, 90);

      // Звёзды и огни города
      for (let i = 0; i < 42; i++) {
        const x = (i * 83 + 17) % W;
        const y = (i * 47 + 19) % 235;

        g.fillStyle(
          i % 4 === 0 ? 0xf5c78b : 0x9caec6,
          i % 3 === 0 ? 0.65 : 0.28
        );

        g.fillRect(x, y, 2, 2);
      }

      // Силуэты домов
      const blocks = [
        [0, 190, 115, 180],
        [105, 150, 90, 220],
        [190, 205, 120, 165],
        [480, 180, 120, 190],
        [590, 140, 130, 230],
        [715, 195, 100, 175],
        [810, 160, 150, 210]
      ];

      blocks.forEach((b, i) => {
        const [x, y, w, h] = b;

        g.fillStyle(i % 2 ? 0x27354a : 0x202e42, 1);
        g.fillRect(x, y, w, h);

        g.fillStyle(0x101a2a, 1);
        g.fillRect(x, y, w, 7);

        for (let yy = y + 18; yy < y + h - 10; yy += 23) {
          for (let xx = x + 10; xx < x + w - 8; xx += 19) {
            g.fillStyle(
              (xx + yy) % 5 === 0 ? 0xd9a66e : 0x52647a,
              0.5
            );

            g.fillRect(xx, yy, 5, 8);
          }
        }
      });

      // Улица
      g.fillStyle(0x111925, 1);
      g.fillRect(0, 365, W, 175);

      g.fillStyle(0x283244, 0.7);
      g.fillRect(0, 365, W, 3);

      for (let i = 0; i < 15; i++) {
        g.fillStyle(0x394252, 0.5);
        g.fillRect(i * 73, 400 + (i % 3) * 17, 35, 2);
      }

      // Световые пятна
      g.fillStyle(0xe9a46e, 0.08);
      g.fillEllipse(220, 370, 260, 70);

      g.fillStyle(0x91a9c8, 0.06);
      g.fillEllipse(720, 370, 280, 75);
    }

    drawApartment(offset, who) {
      const g = this.add.graphics();
      const left = offset;
      const right = offset + 480;

      // Стены квартиры
      g.fillStyle(
        who === "anya" ? 0x6a4b4b : 0x46566a,
        0.95
      );

      g.fillRect(left + 36, 190, 408, 235);

      g.fillStyle(
        who === "anya" ? 0x9a7165 : 0x6b7b8d,
        1
      );

      g.fillRect(left + 48, 202, 384, 211);

      // Фактура стен
      for (let x = left + 55; x < right - 50; x += 24) {
        g.fillStyle(0x171f2c, 0.08);
        g.fillRect(x, 204, 2, 207);
      }

      // Пол
      g.fillStyle(0x302a31, 1);
      g.fillRect(left + 36, 400, 408, 25);

      g.fillStyle(0x6b4d43, 0.8);

      for (let x = left + 40; x < right - 35; x += 42) {
        g.fillRect(x, 402, 2, 21);
      }

      // Окно
      g.fillStyle(0x111b2b, 1);
      g.fillRect(left + 75, 220, 172, 140);

      g.fillStyle(0x253c55, 1);
      g.fillRect(left + 81, 226, 160, 128);

      // Город за окном
      g.fillStyle(0x17263b, 1);
      g.fillRect(left + 81, 302, 160, 52);

      const buildings = [
        [86, 274, 20, 28],
        [111, 258, 25, 44],
        [143, 283, 24, 19],
        [174, 265, 24, 37],
        [206, 277, 28, 25]
      ];

      buildings.forEach(r => {
        g.fillRect(r[0], r[1], r[2], r[3]);
      });

      // Окна соседних домов
      for (let i = 0; i < 18; i++) {
        const x = left + 86 + (i % 6) * 25;
        const y = 308 + Math.floor(i / 6) * 13;

        g.fillStyle(
          i % 4 === 0 ? 0xeab77d : 0x7188a1,
          i % 4 === 0 ? 0.9 : 0.5
        );

        g.fillRect(x, y, 5, 5);
      }

      // Оконная рама
      g.fillStyle(0x332e35, 1);
      g.fillRect(left + 155, 220, 4, 140);
      g.fillRect(left + 75, 287, 172, 4);

      g.fillStyle(0x352c31, 1);
      g.fillRect(left + 68, 359, 187, 7);

      // Светильник
      g.fillStyle(0x2c2630, 1);
      g.fillRect(left + 354, 220, 3, 44);

      g.fillStyle(0xe9c18a, 0.95);
      g.fillTriangle(
        left + 334, 264,
        left + 377, 264,
        left + 355, 237
      );

      g.fillStyle(0xe9c18a, 0.09);
      g.fillEllipse(left + 355, 294, 120, 72);

      // Стол
      g.fillStyle(0x392b2b, 1);
      g.fillRect(left + 285, 347, 118, 9);

      g.fillStyle(0x241f26, 1);
      g.fillRect(left + 296, 356, 6, 47);
      g.fillRect(left + 390, 356, 6, 47);

      // Телефон, кружка, книги
      g.fillStyle(0x1c202b, 1);
      g.fillRect(left + 327, 336, 19, 3);
      g.fillRect(left + 333, 330, 7, 7);

      g.fillStyle(0xceb08a, 1);
      g.fillRect(left + 365, 337, 12, 10);

      g.fillStyle(0x8e5960, 1);
      g.fillRect(left + 290, 336, 25, 8);

      // Диван
      g.fillStyle(
        who === "anya" ? 0x76505b : 0x42566c,
        1
      );

      g.fillRect(left + 56, 365, 145, 35);

      g.fillStyle(0xc0a49a, 1);
      g.fillRect(left + 64, 359, 58, 14);

      g.fillStyle(0x202532, 1);
      g.fillRect(left + 56, 396, 145, 8);

      // Растение
      g.fillStyle(0x463b37, 1);
      g.fillRect(left + 410, 365, 22, 30);

      g.fillStyle(0x416b5a, 1);

      [
        [414, 350],
        [425, 342],
        [434, 354],
        [418, 338],
        [431, 333]
      ].forEach(p => {
        g.fillEllipse(p[0], p[1], 15, 9);
      });

      // Картина
      g.fillStyle(0x2c2932, 1);
      g.fillRect(left + 282, 225, 47, 58);

      g.fillStyle(
        who === "anya" ? 0xb97e78 : 0x8192a5,
        1
      );

      g.fillRect(left + 287, 230, 37, 48);

      g.fillStyle(0xe7c69a, 0.55);
      g.fillRect(left + 293, 236, 24, 2);

      // Дверь
      g.fillStyle(0x45343a, 1);
      g.fillRect(left + 390, 285, 42, 115);

      g.fillStyle(0x8e6a57, 1);
      g.fillRect(left + 395, 290, 32, 105);

      g.fillStyle(0xd6b17e, 1);
      g.fillCircle(left + 420, 345, 2);
    }

    drawSplit() {
      const g = this.add.graphics();

      g.fillStyle(0x0d1523, 0.9);
      g.fillRect(0, 0, W, 184);

      g.fillStyle(0x0b111c, 0.95);
      g.fillRect(0, 0, W, 4);

      g.fillStyle(0xe6a77b, 0.8);
      g.fillRect(0, 180, W, 2);

      g.fillStyle(0x111a29, 0.96);
      g.fillRect(0, 425, W, 115);

      g.fillStyle(0xe6a77b, 0.8);
      g.fillRect(478, 0, 4, H);

      // Имена персонажей
      this.add.text(28, 26, "АНЯ", {
        fontFamily: "Arial",
        fontSize: "13px",
        fontStyle: "bold",
        color: "#f0c4a4",
        letterSpacing: 4
      });

      this.add.text(508, 26, "САША", {
        fontFamily: "Arial",
        fontSize: "13px",
        fontStyle: "bold",
        color: "#c1d1e4",
        letterSpacing: 4
      });

      this.add.text(28, 48, "ГРИБОЕДОВА, 168", {
        fontFamily: "Arial",
        fontSize: "9px",
        color: "#c3b4ad",
        letterSpacing: 2
      });

      this.add.text(508, 48, "ПРОСПЕКТ КУЗНЕЦОВА, 17", {
        fontFamily: "Arial",
        fontSize: "9px",
        color: "#aab9ca",
        letterSpacing: 2
      });

      this.add.text(28, 444, "ОНА", {
        fontFamily: "Arial",
        fontSize: "9px",
        color: "#d5a28d",
        letterSpacing: 3
      });

      this.add.text(508, 444, "ОН", {
        fontFamily: "Arial",
        fontSize: "9px",
        color: "#9eb5d0",
        letterSpacing: 3
      });
    }

    createPeople() {
      this.anya = this.makePerson("anya");
      this.sasha = this.makePerson("sasha");

      this.anya.x = 205;
      this.anya.y = 343;

      this.sasha.x = 685;
      this.sasha.y = 343;

      this.anya.setDepth(5);
      this.sasha.setDepth(5);
    }

    makePerson(kind) {
      const canvas = document.createElement("canvas");

      canvas.width = 48;
      canvas.height = 76;

      const ctx = canvas.getContext("2d");

      const px = (x, y, w, h, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      };

      // Тень
      px(8, 68, 32, 4, "#151923");

      // Ноги
      px(15, 51, 7, 17, "#272a35");
      px(27, 51, 7, 17, "#272a35");

      // Обувь
      px(12, 66, 12, 4, "#171b25");
      px(26, 66, 12, 4, "#171b25");

      // Тело
      px(
        10, 31, 28, 23,
        kind === "anya" ? "#8b4e59" : "#465d79"
      );

      px(
        13, 34, 22, 17,
        kind === "anya" ? "#a9646a" : "#5d7896"
      );

      // Руки
      px(6, 34, 6, 19, "#d7a47f");
      px(36, 34, 6, 19, "#d7a47f");

      // Шея и лицо
      px(19, 24, 10, 9, "#dba986");
      px(13, 10, 22, 17, "#e4b894");

      px(11, 14, 4, 12, "#d5a17f");
      px(33, 14, 4, 12, "#d5a17f");

      // Волосы
      if (kind === "anya") {
        // Аня — блондинка с длинными светлыми волосами
        px(11, 7, 26, 10, "#e8c66f");
        px(9, 12, 6, 29, "#d9b45e");
        px(33, 12, 6, 29, "#d9b45e");

        px(13, 5, 22, 5, "#f1d98c");
        px(13, 17, 22, 4, "#e4c16d");

        px(15, 19, 3, 2, "#f0d48b");
        px(29, 19, 3, 2, "#f0d48b");
      } else {
        // Саша
        px(11, 7, 26, 10, "#4b342e");
        px(10, 12, 5, 12, "#3d2c2a");
        px(33, 12, 5, 12, "#3d2c2a");
        px(14, 5, 22, 5, "#5a3d32");
      }

      // Глаза
      px(17, 18, 3, 2, "#513a35");
      px(28, 18, 3, 2, "#513a35");

      // Нос
      px(23, 21, 2, 2, "#bd866e");

      const textureKey = "person-" + kind;

      if (this.textures.exists(textureKey)) {
        this.textures.remove(textureKey);
      }

      const texture = this.textures.createCanvas(
        textureKey,
        48,
        76
      );

      texture.context.drawImage(canvas, 0, 0);
      texture.refresh();

      const sprite = this.add.image(
        0,
        0,
        textureKey
      );

      sprite.setOrigin(0.5, 1);
      sprite.setScale(3);

      const container = this.add.container(0, 0, [sprite]);

      // Спокойная анимация дыхания
      this.tweens.add({
        targets: container,
        y: "-=2",
        duration: 1400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });

      return container;
    }

    createAtmosphere() {
      // Дождь
      this.rain = this.add.graphics();
      this.rain.setDepth(2);

      for (let i = 0; i < 85; i++) {
        const x = (i * 67 + 23) % W;
        const y = (i * 41 + 12) % 360;

        this.rain.lineStyle(1, 0x9eb7d0, 0.16);
        this.rain.lineBetween(x, y, x - 3, y + 10);
      }

      this.rain.setAlpha(0.65);

      this.tweens.add({
        targets: this.rain,
        alpha: 0.28,
        duration: 1700,
        yoyo: true,
        repeat: -1
      });

      // Тёплое мерцание ламп
      const glow = this.add.graphics();
      glow.setDepth(1);

      glow.fillStyle(0xf0bd7e, 0.035);
      glow.fillEllipse(355, 310, 210, 190);
      glow.fillEllipse(835, 310, 210, 190);

      this.tweens.add({
        targets: glow,
        alpha: 0.5,
        duration: 2100,
        yoyo: true,
        repeat: -1
      });
    }

    twinkle() {
      if (!this.scene.isActive()) return;

      const x = Phaser.Math.Between(30, 930);
      const y = Phaser.Math.Between(70, 170);

      const dot = this.add.circle(
        x,
        y,
        Phaser.Math.Between(1, 2),
        0xf5d6a5,
        0.7
      );

      dot.setDepth(6);

      this.tweens.add({
        targets: dot,
        alpha: 0,
        scale: 2,
        duration: 1300,
        onComplete: () => dot.destroy()
      });
    }

    next() {
      if (this.page < lines.length - 1) {
        this.page++;
      } else {
        this.page = 0;
      }

      const item = lines[this.page];

      document.getElementById("speaker").textContent =
        item.speaker;

      document.getElementById("line").textContent =
        item.text;

      if (this.page === 1) {
        this.tweens.add({
          targets: this.anya,
          scaleX: 1.025,
          duration: 500,
          yoyo: true
        });
      }

      if (this.page === 2) {
        this.tweens.add({
          targets: this.sasha,
          scaleX: 1.025,
          duration: 500,
          yoyo: true
        });
      }

      if (this.page === 3) {
        this.cameras.main.flash(
          450,
          235,
          190,
          145
        );

        this.tweens.add({
          targets: [this.anya, this.sasha],
          alpha: 0.88,
          duration: 650,
          yoyo: true
        });
      }

      const button = document.getElementById("next-line");

      if (this.page === lines.length - 1) {
        button.innerHTML = 'Сначала снова <span>↻</span>';
      } else {
        button.innerHTML = 'Далее <span>→</span>';
      }
    }
  }

  const config = {
    type: Phaser.AUTO,

    parent: "game",

    width: W,
    height: H,

    backgroundColor: "#101725",

    pixelArt: true,
    roundPixels: true,
    antialias: false,

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },

    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true
    },

    scene: [OpeningScene]
  };

  const game = new Phaser.Game(config);

  const advance = () => {
    const scene = game.scene.getScene("OpeningScene");

    if (scene && scene.scene.isActive()) {
      scene.next();
    }
  };

  document
    .getElementById("next-line")
    .addEventListener("click", advance);

  window.addEventListener("keydown", event => {
    if (
      event.code === "Space" ||
      event.code === "Enter"
    ) {
      event.preventDefault();
      advance();
    }
  });

})();

import "./style.scss";
import { da, en } from "./i18n.json";

document.querySelector("#app").innerHTML = `
  <section class="overview"></section>
  <div class="current"></div>
  <ul class="all"></ul>
  <ul class="picked"></ul>
  <button class="draw">Grab a ball!</button>
  <div class="controls">
    <button class="reset">Reset game</button>
    <button class="shuffle">Shake bag</button>
    <input type="radio" value="en" name="language">EN
    <input type="radio" value="da" name="language"> DA
  </div>
`;

const d = document;
const dc = (tag) => {
  return d.createElement(tag);
};

const createBall = (n) => {
  const ball = dc("b");
  ball.classList.add("ball");
  //ball.classList.add("red");
  ball.textContent = n;
  return ball;
};
const selectBall = (item) => item.classList.add("drawn");

const app = {
  numbers: [],
  pickedNumbers: [],
  displaynumbers: [],

  init() {
    console.log("init");
    d.querySelector(".draw").addEventListener("click", app.click);
    d.querySelector(".reset").addEventListener("click", () => {
      app.resetNumbers();
      app.updateCurrent();
      app.updatePickedNumbers();
      app.updateButton();
    });
    app.resetNumbers();
    app.buildGrid();
  },
  click: () => {
    app.shuffle();
    app.moveNext();
    app.updatePickedNumbers();
    app.updateGrid();
    app.updateCurrent();
    app.updateButton();
  },
  updateButton() {
    d.querySelector(".draw").disabled = app.numbers.length === 0;
  },
  buildGrid() {
    // todo reduce...
    //const numbers = app.numbers.reduce((newArray, item) => {
    //      return newArray.concat([item)
    //    }, []);
    const dnumbers = [...app.numbers];
    [9, 10, 21, 32, 43, 54, 65, 76, 87].forEach((n) => {
      dnumbers.splice(n, 0, "");
    });

    const items = dnumbers.map((n) => {
      return n ? createBall(n) : dc("b");
    });
    d.querySelector(".overview").append(...items);
  },
  updateGrid() {
    const grid = d.querySelectorAll(".overview b:not(.drawn)");
    // todo use replacechildren
    grid.forEach((item, index) => {
      if (app.pickedNumbers.includes(+item.innerHTML)) {
        selectBall(item);
      }
    });
  },
  resetNumbers() {
    app.numbers = [
      ...Array(90)
        .keys()
        .map((n) => n + 1),
    ];
    app.pickedNumbers = [];
  },

  shuffle() {
    for (var i = app.numbers.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = app.numbers[i];
      app.numbers[i] = app.numbers[j];
      app.numbers[j] = temp;
    }
  },
  moveNext() {
    app.pickedNumbers.push(app.numbers.pop());
  },
  updatePickedNumbers: () => {
    const list2 = d.querySelector(".all");
    const list = d.querySelector(".picked");
    list.innerHTML = "";

    const allPicked = app.pickedNumbers.map((n) => {
      return (dc("li").textContent = n);
    });
    list2.replaceChildren(...allPicked);
    app.pickedNumbers.slice(-6, -1).forEach((n) => {
      const item = dc("li");
      item.append(createBall(n));
      list.append(item);
    });
  },
  updateCurrent() {
    const c = d.querySelector(".current");
    // look into .at
    const n = app.pickedNumbers.slice(-1)[0];
    if (!n) {
      c.innerHTML = "";
      return;
    }
    d.querySelector(".current").replaceChildren(createBall(n));
    const f = da[n];
    if (f) {
      const text = d.createElement("p");
      text.textContent = f;
      d.querySelector(".current").append(text);
    }
  },
};

app.init();

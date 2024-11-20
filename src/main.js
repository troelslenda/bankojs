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
        d.querySelector(".draw").addEventListener("click", () => {
            app.moveNext();
            app.updateUI();
        });
        d.querySelector(".reset").addEventListener("click", () => {
            app.newGame();
            //app.updateUI();
        });
        d.querySelector(".shuffle").addEventListener("click", () => {
            app.shuffle();
        });
        app.newGame();
        //app.UI.buildGrid();
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
        for (let i = app.numbers.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = app.numbers[i];
            app.numbers[i] = app.numbers[j];
            app.numbers[j] = temp;
        }
    },
    moveNext() {
        app.pickedNumbers.push(app.numbers.pop());
    },

    newGame() {
        app.resetNumbers();
        app.UI.buildGrid();
        app.updateUI();
        app.shuffle();
    },
    updateUI() {
        app.UI.updatePickedNumbers();
        app.UI.updateGrid();
        app.UI.updateCurrent();
        app.UI.updateButton();
    },
    UI: {
        buildGrid() {
            const items = [...app.numbers]
                .reduce((a, n, i) => a
                    .concat([9, 9, 19, 29, 39, 49, 59, 69, 79]
                        .filter(j => i === j)
                        .map(_ => ""), n)
                    , [])
                .map((n) => n ? createBall(n) : dc("b"));

            d.querySelector(".overview").replaceChildren(...items);
        },
        updateCurrent() {
            const c = d.querySelector(".current");
            const lastBall = d.querySelector(".all").lastChild
            // look into .at
            if (lastBall)
                c.replaceChildren(lastBall)
            if (lastBall && da[lastBall.textContent]) {
                const text = dc("p");
                text.textContent = da[lastBall.textContent];
                d.querySelector(".current").append(text);
            }
        },
        updatePickedNumbers: () => {
            const allPicked = app.pickedNumbers.map((n) => {
                const l = dc("li");
                l.replaceChildren(createBall(n))
                return l;
            });
            d.querySelector(".all").replaceChildren(...allPicked);

        },
        updateButton() {
            d.querySelector(".draw").disabled = app.numbers.length === 0;
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

    }
};

app.init();

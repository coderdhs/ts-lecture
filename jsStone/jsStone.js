"use strict";
var opponent = {
    hero: document.getElementById("rival-hero"),
    deck: document.getElementById("rival-deck"),
    field: document.getElementById("rival-cards"),
    cost: document.getElementById("rival-cost"),
    deckData: [],
    heroData: null,
    fieldData: [],
    chosenCard: null,
    chosenCardData: null
};
var me = {
    hero: document.getElementById("my-hero"),
    deck: document.getElementById("my-deck"),
    field: document.getElementById("my-cards"),
    cost: document.getElementById("my-cost"),
    deckData: [],
    heroData: null,
    fieldData: [],
    chosenCard: null,
    chosenCardData: null
};
var turnButton = document.getElementById("turn-btn");
var turn = true; // true면 내턴, false면 니턴
function deckToField(data, turn) {
    var target = turn ? me : opponent; // 조건 ? 참 : 거짓;
    var currentCost = Number(target.cost.textContent);
    if (currentCost < data.cost) {
        return "end";
    }
    var idx = target.deckData.indexOf(data);
    target.deckData.splice(idx, 1);
    target.fieldData.push(data);
    redrawField(target);
    redrawDeck(target);
    data.field = true;
    target.cost.textContent = currentCost - data.cost;
}
function redrawField(target) {
    target.field.innerHTML = "";
    target.fieldData.forEach(function (data) {
        connectCardDOM(data, target.field);
    });
}
function redrawDeck(target) {
    target.deck.innerHTML = "";
    target.deckData.forEach(function (data) {
        connectCardDOM(data, target.deck);
    });
}
function redrawHero(target) {
    if (!target.heroData) {
        console.error(target);
        throw new Error("heroData가 없습니다");
    }
    target.hero.innerHTML = "";
    connectCardDOM(target.heroData, target.hero, true);
}
function redrawScreen(turn) {
    var target = turn ? me : opponent; // 조건 ? 참 : 거짓;
    redrawField(target);
    redrawDeck(target);
    redrawHero(target);
}
function turnAction(cardEl, data, turn) {
    // 턴이 끝난 카드면 아무일도 일어나지 않음
    var team = turn ? me : opponent;
    var enemy = turn ? opponent : me;
    if (cardEl.classList.contains("card-turnover")) {
        return;
    }
    // 적군 카드면서 아군 카드가 선택되어 있고, 또 그게 턴이 끝난 카드가 아니면 공격
    var enemyCard = turn ? !data.mine : data.mine;
    if (enemyCard && team.chosenCardData) {
        data.hp = data.hp - team.chosenCardData.att;
        if (data.hp <= 0) {
            // 카드가 죽었을 때
            var index = enemy.fieldData.indexOf(data);
            if (index > -1) {
                // 쫄병이 죽었을 때
                enemy.fieldData.splice(index, 1);
            }
            else {
                // 영웅이 죽었을 때
                alert("승리하셨습니다!");
                initiate();
            }
        }
        redrawScreen(!turn);
        if (team.chosenCard) {
            team.chosenCard.classList.remove("card-selected");
            team.chosenCard.classList.add("card-turnover");
        }
        team.chosenCard = null;
        team.chosenCardData = null;
        return;
    }
    else if (enemyCard) {
        // 상대 카드면
        return;
    }
    if (data.field) {
        // 카드가 필드에 있으면
        //  영웅 부모와 필드카드의 부모가 다르기때문에 document에서 모든 .card를 검색한다
        // 카드.parentNode.querySelectorAll('.card').forEach(function (card) {
        document.querySelectorAll(".card").forEach(function (card) {
            card.classList.remove("card-selected");
        });
        cardEl.classList.add("card-selected");
        team.chosenCard = cardEl;
        team.chosenCardData = data;
    }
    else {
        // 덱이 있으면
        if (deckToField(data, turn) !== "end") {
            turn ? createMyDeck(1) : createEnemyDeck(1);
        }
    }
}
function connectCardDOM(data, DOM, hero) {
    var cardEl = document.querySelector(".card-hidden .card").cloneNode(true);
    cardEl.querySelector(".card-cost").textContent = String(data.cost);
    cardEl.querySelector(".card-att").textContent = String(data.att);
    cardEl.querySelector(".card-hp").textContent = String(data.hp);
    if (hero) {
        cardEl.querySelector(".card-cost").style.display = "none";
        var name_1 = document.createElement("div");
        name_1.textContent = "영웅";
        cardEl.appendChild(name_1);
    }
    cardEl.addEventListener("click", function () {
        turnAction(cardEl, data, turn);
    });
    DOM.appendChild(cardEl);
}
function createEnemyDeck(count) {
    for (var i = 0; i < count; i++) {
        opponent.deckData.push(new Card());
    }
    redrawDeck(opponent);
}
function createMyDeck(count) {
    for (var i = 0; i < count; i++) {
        me.deckData.push(new Card(false, true));
    }
    redrawDeck(me);
}
function createMyHero() {
    me.heroData = new Card(true, true);
    connectCardDOM(me.heroData, me.hero, true);
}
function createEnemyHero() {
    opponent.heroData = new Card(true);
    connectCardDOM(opponent.heroData, opponent.hero, true);
}
var Card = /** @class */ (function () {
    function Card(hero, mine) {
        if (hero) {
            this.att = Math.ceil(Math.random() * 2);
            this.hp = Math.ceil(Math.random() * 5) + 25;
            this.hero = true;
            this.field = true;
        }
        else {
            this.att = Math.ceil(Math.random() * 5);
            this.hp = Math.ceil(Math.random() * 5);
            this.cost = Math.floor((this.att + this.hp) / 2);
        }
        if (mine) {
            this.mine = true;
        }
    }
    return Card;
}());
function initiate() {
    [opponent, me].forEach(function (item) {
        item.deckData = [];
        item.heroData = null;
        item.fieldData = [];
        item.chosenCard = null;
        item.chosenCardData = null;
    });
    createEnemyDeck(5);
    createMyDeck(5);
    createMyHero();
    createEnemyHero();
    redrawScreen(true); // 상대화면
    redrawScreen(false); // 내화면
}
turnButton.addEventListener("click", function () {
    var target = turn ? me : opponent;
    document.getElementById("rival").classList.toggle("turn");
    document.getElementById("my").classList.toggle("turn");
    redrawField(target);
    redrawHero(target);
    turn = !turn; // 턴을 넘기는 코드
    if (turn) {
        me.cost.textContent = "10";
    }
    else {
        opponent.cost.textContent = "10";
    }
});
initiate(); // 진입점

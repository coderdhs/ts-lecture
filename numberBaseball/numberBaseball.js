var body = document.body;
var candidate;
var array = [];
function chooseNumber() {
    candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = 0; i < 4; i++) {
        var chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
        array.push(chosen);
    }
}
chooseNumber();
console.log(array);
var result = document.createElement("h1");
body.append(result);
var form = document.createElement("form");
body.append(form);
var input = document.createElement("input");
form.append(input);
input.type = "text";
input.maxLength = 4;
var button = document.createElement("button");
button.textContent = "input!";
form.append(button);
var wrongCount = 0;
form.addEventListener('submit', function (event) {
    event.preventDefault();
    var answer = input.value;
    if (answer === array.join('')) {
        result.textContent = 'homerun';
        input.value = '';
        input.focus();
        chooseNumber();
        wrongCount = 0;
    }
    else {
        var answerArray = answer.split('');
        var strike = 0;
        var ball = 0;
        wrongCount++;
        if (wrongCount > 10) {
            result.textContent = "the answer is " + array.join(',');
            input.value = '';
            input.focus();
            chooseNumber();
            wrongCount = 0;
        }
        else {
            for (var i = 0; i <= 3; i++) {
                if (Number(answerArray[i]) === array[i]) {
                    strike++;
                }
                else if (array.indexOf(Number(answerArray[i])) > -1) {
                    ball++;
                }
            }
        }
        result.textContent = strike + " strike " + ball + " ball";
        input.value = '';
        input.focus();
    }
});

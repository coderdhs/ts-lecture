const { body } = document;
let candidate: number[];
let array: number[] = [];

function chooseNumber() {
  candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 4; i++) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
}

chooseNumber();
console.log(array);

const result = document.createElement("h1");
body.append(result);
const form = document.createElement("form");
body.append(form);
const input = document.createElement("input");
form.append(input);
input.type = "text";
input.maxLength = 4;
const button = document.createElement("button");
button.textContent = "input!";
form.append(button);

let wrongCount = 0;
form.addEventListener('submit', event => {
    event.preventDefault()
    const answer = input.value;
    if(answer === array.join('')){
        result.textContent = 'homerun'
        input.value = ''
        input.focus()
        chooseNumber()
        wrongCount = 0
    } else {
        const answerArray = answer.split('')
        let strike =0;
        let ball = 0
        wrongCount++
        if(wrongCount > 10){
            result.textContent = `the answer is ${array.join(',')}`
            input.value = ''
            input.focus()
            chooseNumber()
            wrongCount = 0
        }else {
            for ( let i = 0; i <= 3; i++){
                if(Number(answerArray[i]) === array[i]){
                    strike++
                } else if(array.indexOf(Number(answerArray[i])) > -1){
                    ball++
                }
            }
        }
        result.textContent = `${strike} strike ${ball} ball`
        input.value = ''
        input.focus()
    }
})
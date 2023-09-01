// Select Elements
let countSpan = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let theResultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
            questionsObject = JSON.parse(this.responseText);
            qCount = questionsObject.length;
            createBullets(qCount);
            addQuestionData(questionsObject[currentIndex], qCount);
            // Start CountDown
            countdown(5, qCount);
            submitButton.onclick = () => {
                // Get Right Answer
                let rightAnswers = questionsObject[currentIndex].right_answer;
                // Increase Index
                currentIndex++;
                // Check The Answer
                checkAnswer(rightAnswers, qCount);
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestionData(questionsObject[currentIndex], qCount);
                handleBullets();
                clearInterval(countdownInterval);
                countdown(5, qCount);
                showResults(qCount);
            };
        }
    };
    myRequest.open("GET", "quize.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
    for (i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        // Check If Its First Span
        if (i == 0) {
            theBullet.className = "on";
        }
        bulletsContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h1");
        let questionText = document.createTextNode(obj.title);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
        for (i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            let inputRidio = document.createElement("input");
            inputRidio.name = "question";
            inputRidio.type = "radio";
            inputRidio.id = `answer_${i}`;
            inputRidio.dataset.answer = obj[`answer_${i}`];
            if (i == 1) {
                inputRidio.checked = true;
            }
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i}`;
            let textLabel = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(textLabel);
            mainDiv.appendChild(inputRidio);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    // console.log(answers);
    for (i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log("hoda");
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(numbers) {
    let theResults;
    if (currentIndex === numbers) {
        quizArea.remove();
        answersArea.remove();
        bullets.remove();
        if (rightAnswers > numbers / 2 && rightAnswers > numbers) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${numbers}`;
        } else if (rightAnswers === numbers) {
            theResults = `<span class="perfect"> Perfect</span> , All Answers Is Good`;
        } else {
            theResults = `<span class="bad"> bad</span> ,${rightAnswers} form ${numbers}`;
        }
        theResultContainer.innerHTML = theResults;
    }
}
function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.onclick();
            }
        }, 1000);
    }
}

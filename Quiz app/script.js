//1. Set and initialize variables 

var questionCount = 0;
var score = 0;
var ans;
var timedOut = 0;
var rand;
var record = [];
var status = 0;

function $(id) {
	return document.getElementById(id);
}

var quiz = $("quiz");
var quizSet = $("quizSet");
var resultBox = $("resultBox");
var question = $("question");
var option1 = $("option1");
var option2 = $("option2");
var option3 = $("option3");
var option4 = $("option4");
var submit = $("submit");
var progress = $("progress");
var result = $("result");
var retake = $("retake");
var button1 = $("btn1");
var button2 = $("btn2");
var button3 = $("btn3");
var button4 = $("btn4");

var tracker;
var countDown;
var secsInput = 5;
var seconds = secsInput;
var t;

//2. Load current question into the app 
//Setting the question 
function setQuestion(qCount, rand) {
	var ques = questions[rand];
	question.textContent = (qCount+1) + ". " + ques.question;
	option1.textContent = ques.option1;
	option2.textContent = ques.option2;
	option3.textContent = ques.option3;
	option4.textContent = ques.option4;
}

function changeProgressBar(qCount) {
	progress.innerHTML = "Question " + (qCount+1) + " of 10";
	tracker = $("no" + (qCount+1));
	tracker.style.backgroundColor = "#cc7a00";
}

function defaultOptionColors() {
	button1.style.backgroundColor = "#e6f3ff";
	button2.style.backgroundColor = "#e6f3ff";
	button3.style.backgroundColor = "#e6f3ff";
	button4.style.backgroundColor = "#e6f3ff";
}

function getQuestion(qCount, rand) {
	if(qCount == 9) { //last question
		submit.innerHTML = "Submit Test";
		submit.style.backgroundColor = "#00b300";
	}
	
	if(qCount > 9) {
		return;
	}
	
	setQuestion(qCount,rand);
	changeProgressBar(qCount);
	defaultOptionColors();
	
	startTimer(seconds, "timer");
}


//3. Create functions we need - setting tracker, setting result, calculating and display final score 
function setCorrect() {
	score++;
	tracker.style.backgroundColor = "#009900";
}

function setWrong() {
	tracker.style.backgroundColor = "#cc0000";
}

function finalScore() {
	if(score > 5) {
		result.innerHTML = "Congrats! You passed! <br/> Your score is " + score + "!";
	}
	else {
		result.innerHTML = "Sorry. You failed. <br/> Your score is " + score + "!";
	}
}

function setResultPage() {
	quizSet.style.display = "none";
	resultBox.style.display = "block";
	progress.innerHTML = "Quiz Completed";
	timer.textContent = "00:00";
	finalScore();
}

//4. Generate random, unused number and set timer
function randomGenerator() {
	while(status == 0) {
		rand = Math.round(Math.random() * questions.length);
		if(rand !== questions.length) {
			//run through record array to find if its unique
			for(var j=0; j<record.length; j++) {
				if(rand === record[j]) {
					break;
				}
				
				else if(j == record.length - 1) {
					record[questionCount] = rand;
					status = 1;
				}
			}
		}
	}
	status = 0;

	return rand;
}

//Timer function
function startTimer(secs, elem) {
	t = $(elem);
	t.innerHTML = "00:" + secs;
	
	if(secs<0) {
		clearTimeout(countDown);
		//call the next question or set the result page
		
		//no option selected - wrong 
		if(button1.style.backgroundColor !== "rgb(26, 255, 26)" && button2.style.backgroundColor !== "rgb(26, 255, 26)" && button3.style.backgroundColor !== "rgb(26, 255, 26)" && button4.style.backgroundColor !== "rgb(26, 255, 26)") {
			//if we are at the last question
			if(questionCount == 9) {
				setWrong();
				setResultPage();
				return;
			}
			setWrong();
			secs = secsInput;
			getQuestion(++questionCount, randomGenerator());
		}
		
		else { //They've selected an option
			if(questionCount == 9) {
				if(ans === questions[rand].answer) {
					setCorrect();
				}
				else {
					setWrong();
				}
				setResultPage();
				return;
			}
			
			if(ans == questions[rand].answer) {
				setCorrect();
				secs = secsInput;
				getQuestion(++questionCount, randomGenerator());
			}
			
			else {
				setWrong();
				secs = secsInput;
				getQuestion(++questionCount, randomGenerator());
			}
			
		}
		return;
	}
	
	secs--;
	//recurring function
	countDown = setTimeout('startTimer('+secs+',"'+elem+'")', 1000);
	
}

//startTimer(seconds,"timer");

//5. Making the option selection work 
option1.addEventListener("click",optionSelect);
option2.addEventListener("click",optionSelect);
option3.addEventListener("click",optionSelect);
option4.addEventListener("click",optionSelect);

function optionSelect(e) {
	//get parent element and change background color 
	var parentEl = e.target.parentElement;
	parentEl.style.backgroundColor = "#1aff1a";
	
	//switch statement - the other buttons' colors go back to default
	switch(e.target.id) {
		case "option1": button2.style.backgroundColor = "#e6f3ff";
						button3.style.backgroundColor = "#e6f3ff";
						button4.style.backgroundColor = "#e6f3ff";
						break;
		case "option2": button1.style.backgroundColor = "#e6f3ff";
						button3.style.backgroundColor = "#e6f3ff";
						button4.style.backgroundColor = "#e6f3ff";
						break;
		case "option3": button1.style.backgroundColor = "#e6f3ff";
						button2.style.backgroundColor = "#e6f3ff";
						button4.style.backgroundColor = "#e6f3ff";
						break;
		case "option4": button1.style.backgroundColor = "#e6f3ff";
						button2.style.backgroundColor = "#e6f3ff";
						button3.style.backgroundColor = "#e6f3ff";
						break;
	}
	
	//set ans value based on the option selected 
	ans = parseInt(e.target.id.replace("option",""),10);
}

//6. Loading the next question after the next question button is clicked 
submit.addEventListener("click",nextQuestion);

function nextQuestion() {
	//no option selected
	console.log(button1.style.backgroundColor);
	console.log(button1.style.backgroundColor !== "rgb(26, 255, 26)");
	if(button1.style.backgroundColor !== "rgb(26, 255, 26)" && button2.style.backgroundColor !== "rgb(26, 255, 26)" && button3.style.backgroundColor !== "rgb(26, 255, 26)" && button4.style.backgroundColor !== "rgb(26, 255, 26)") {
		alert("Please select an option");
		return;
	}
	else {
		clearTimeout(countDown);
		secs = secsInput; 
		
		//if its the last question - load result page 
		if(questionCount == 9 && questionCount != 10) { 
			if(ans == questions[rand].answer) {
				setCorrect();
			}
			else {
				setWrong();
			}
			setResultPage();
			return;
		}
		
		if(ans == questions[rand].answer) {
			setCorrect();
			getQuestion(++questionCount, randomGenerator());
		}
		else {
			setWrong();
			getQuestion(++questionCount, randomGenerator());
		}	
	}
}

//7. Final parts - retake button, setting up random number for the first time, what happens when the page first loads etc
//Retake button 
retake.addEventListener("click",retakeTest);

function retakeTest() {
	window.location.reload();
}

rand = Math.round(Math.random() * questions.length);
while(rand == questions.length) {
	rand = Math.round(Math.random() * questions.length);
}

record[0] = rand;

//onload function
window.onload = getQuestion(questionCount, rand);



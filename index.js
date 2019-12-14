var Questions = [
	{
		question: 'What does CSS stand for?',
		answers: {
			a: 'Colorful Style Sheets;',b: 'Creative Style Sheets',c: 'Cascading Style Sheets',d: 'Computer Style Sheets'
		},
		correctAnswer: 'c',
	},
	{
		question:
			"What is the correct syntax for referring to an external script called 'geek.js'?",
		answers: {
			a: 'At the end of the documen',b: 'In the <head> section ',c: 'n the <body> section',
		},
		correctAnswer: 'b',
	},
	{
		question:
			'Which HTML tag is used to define an internal style sheet?',
		answers: {
			a: 'css',b: 'script',c: 'style',
		},
		correctAnswer: 'c',
	},
	{
		question: 'Which HTML attribute is used to define inline styles?',
		answers: {a: 'style',b: 'font',c: 'styles',d: 'class;'},
		correctAnswer: 'a',
	},
];

// track question
var questionIndex = 0;
var numCorrect = 0;


// START button
function startQuiz() {
	$('.js-container').on('click', '.start', function(event) {
		$('.js-message').hide();

		$('.js-quiz-container').show();
		renderQuestion('submit');
	});
}
function showDefaultMessage(){
	$('.js-message').html(`
      <h2>Code quiz</h2>
      <button type="button" class="start">Start Quiz</button>`);
}
function hideMessage(){
	$('.js-message').hide();
}

	function restartQuiz() {
	// user clicks restart

		$('.js-container').on('click', '.restart', function(event) {

			// reset question 
			questionIndex = 0;
			numCorrect = 0;
			// show initial message
			showDefaultMessage();
			
		// hide the last question & review button (from the final page)
		$('.js-quiz-container').hide();
		});
	}

function renderLastPage() {

	$('.js-message').show().html(`


	  <h2>You finished the quiz!</h2>
	  

      <h3>Final Score:<br>${numCorrect} out of ${Questions.length}<br>
      ${(numCorrect/Questions.length) * 100}%</h3>
	  <button type="button" class="restart">Restart Quiz</button>`);
	
	// hide the last question when show the final page
	$('.js-quiz-container').hide();

	// load the restartQuiz function - which is triggered by the restart button created above
	restartQuiz();
	
}

// Next Question
function renderNextQuestion() {

	$('.js-quiz-container').on('submit', '#continue-form', function(event) {
		event.preventDefault();

		if (questionIndex === Questions.length - 1) {
			renderLastPage();
		} else {
			questionIndex += 1;
			renderQuestion('submit');
		}

	});
}

// Resultes
function renderResults() {

	$('.js-quiz-container').on('submit', '#submit-form', function(event) {
		event.preventDefault();

		var userAnswer = $("input[name='answer']:checked").val();

		var currentQuestionObj = Questions[questionIndex];
		currentQuestionObj.userAnswer = userAnswer;
		
		if (currentQuestionObj.correctAnswer === userAnswer) {
			numCorrect += 1;
		}

		renderQuestion('continue', userAnswer);
	});
}

function generateQuestionHTML(btn, userAnswer, qIn) {
		var output = [];

		// for this question store the list of answer options
		var currentQuestion = Questions[qIn];

		const answerOptions = [];
		var correctAnswerClass = '';
		var userAnswerClass = '';
		var disabled = (btn === 'continue' || btn === 'review') ? 'disabled' : '';

		var checked = '';

		var explanation = userAnswer !== '' ? currentQuestion.explanation : '';

		for (var option in currentQuestion.answers) {
					// only when showing results
			if (btn === 'continue' || btn === 'review') {
				if (option === currentQuestion.correctAnswer) {
					correctAnswerClass = 'correct-answer';
				} else {
					correctAnswerClass = '';
				}
				if (option === userAnswer) {
					userAnswerClass = 'user-answer';

							// add checked to the checked radio button
					checked = 'checked';
				} else {
					userAnswerClass = '';
					checked = '';
				}
			}
			answerOptions.push(
				`<label for="answer_${option}">
				<input type="radio" name="answer" id="answer_${option}" value="${option}" ${disabled} ${checked} required>${option}:&nbsp;&nbsp;${
					currentQuestion.answers[option]
				}<span class="warning ${userAnswerClass}"></span><span class="warning ${correctAnswerClass}"></span></label>`
			);
		}
		
		var banner = (btn === 'submit' || btn === 'continue') ? `
		<div class="banner"><span class="js-questionsAnswered">Question: ${qIn + 1} out of ${
			Questions.length
		}</span><span class="js-score">Score: ${numCorrect} out of ${Questions.length}</span>
		</div>` : ''
		var form = (btn === 'submit' || btn === 'continue') ? `<form id="${btn}-form" name="quiz-form" action="index.html" method="post">` : '';
		var button = (btn === 'submit' || btn === 'continue') ? `<button class="${btn}" type="submit">${btn}</button>` : '' ;
		
		// add this question and its answers to the output
		output.push(
			`${banner}

			 ${form}

			<fieldset>
			<legend>
			  <h3><span>${qIn + 1}.</span> ${currentQuestion.question}</h3>
			</legend>

			<ul class="answers">
			<li data-question-id="${qIn}">
				${answerOptions.join('')}
			</li>
			</ul>

			${button}
			
		</fieldset>
		</form>`
		);
		
		return output; 
		
}

function renderQuestion(btn = 'start', userAnswer = '', qIn = questionIndex ) {

	if (btn === 'start') {
		showDefaultMessage();
	} else {
		// insert the final question HTML into the DOM
		$('.js-quiz-container').html(generateQuestionHTML(btn, userAnswer, qIn));
	}
}

function processQuiz() {

	startQuiz();
	renderQuestion();
	renderResults();
	renderNextQuestion();
}

// when the page loads, call `processQuiz`
$(processQuiz);

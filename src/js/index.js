// parcel module need to run async functions
import 'regenerator-runtime/runtime';

import { ajax, json } from './ajax';
import { bsAlert, bsButton, bsCard, bsCheckbox, bsJumbotron, bsProgressBar, bsRadioButton } from './bs-components';
import { addClassById, answersContainer, getRandomNumber, HTMLparser, resultContainer } from './helpers';
import Quiz from './quiz';


(function() {
    let quizUrl = 'https://proto.io/en/jobs/candidate-questions/quiz.json',
        resultUrl = 'https://proto.io/en/jobs/candidate-questions/result.json',
        cardOutput = '.card-output',
        alertOutput = '.alert-output',
        displayeTime = 3000,// after user answer
        animations = ['lightSpeedIn', 'fadeInDownBig', 'bounceInDown', 'flipInY', 'rotateIn', 'slideInUp'],
        quiz,
        resultData;

    let getData = (url) => {
        return ajax(url).get().then(json);
    }

    let getInputs = () => {
        return document.querySelector('.answers').querySelectorAll('input:checked');
    }

    let answerGenerator = (question_type, possible_answers) => {
        if (question_type === 'truefalse') {
            return `${bsRadioButton(true, 'true')} ${bsRadioButton(false, 'false')}`;
        }
    
        if (question_type === 'mutiplechoice-single') {
            return possible_answers.map(answer => bsRadioButton(answer.a_id, answer.caption)).join('');
        }
    
        if( 'mutiplechoice-multiple') {
            return possible_answers.map(answer => bsCheckbox(answer.a_id, answer.caption)).join('');
        }
    }
    /**
    * @returns {string} random animation calss name.  
    */  
    let animation = () => {
        return animations[getRandomNumber(animations.length)];
    }

    let highlighteCorrectAnswer = () => {
        let { correctAnswer } = quiz;

        getInputs().forEach(input => input.checked = false);

        if (Array.isArray(correctAnswer)) {
            return correctAnswer.forEach(id => addClassById(id, 'is-valid'));
        }

        addClassById(correctAnswer, 'is-valid');
    }

    let evaluateUserScore = ({ minpoints, maxpoints }) => {
        return quiz.userScore >= minpoints && quiz.userScore <= maxpoints;
    }

    let addActionButton = (text, type, event) => {
        document.querySelector('.actionBtn').replaceWith( bsButton(text, type, event) );
    }

    let restart = (e) => {
        e.target.removeEventListener("click", restart);
        renderQuestionCard(quiz.restart());
    }

    let render = (className, text) => {
        let output = document.querySelector(className);
        let element = HTMLparser(text);
        output.firstChild ? output.replaceChild(element, output.firstChild) : output.appendChild(element);
        return element;
    }

    let renderQuestionCard = () => {
        let { img, title, question_type, possible_answers } = quiz.question;

        let answers = answerGenerator(question_type, possible_answers),
            text = answersContainer(answers),
            card = bsCard(img, title, text, animation());

        render(cardOutput, card);
        addActionButton('Next question', 'btn-primary', onClick);
    }

    let renderResultCard = (data) => {
        let { img, title, message } = data;
        let score = bsProgressBar(quiz.userScore),
            text = resultContainer(message, score),
            card =  bsCard(img, title, text, animation());

        render(cardOutput, card);
 
        if( quiz.userScore !== 100 ) {
            addActionButton('Try again', 'btn-warning', restart);
        }
    }

    let showResult = () => {
        resultData.results.forEach(result => {
            if (evaluateUserScore(result)) {
                return renderResultCard(result);
            }
        })
    }

    let getUserAnswer = () => {
        let answer = [];
        // conver strings to primitives
        getInputs().forEach(input => answer.push(JSON.parse(input.value)));
    
        if (answer.length < 2) return answer[0];
        return answer
    }

    let onClick = (e) => {

        e.target.disabled = true;
        e.target.removeEventListener("click", onClick);

        let userAnswer = getUserAnswer();

        if (quiz.validatedUserAnswer(userAnswer)) {
            render(alertOutput, bsAlert('success', 'Correct!', 'tada'));
        } else {
            render(alertOutput, bsAlert('danger', 'Wrong!', 'shake'));
            highlighteCorrectAnswer();
        }
    
        setTimeout(() => {
            if (quiz.hasNext) return renderQuestionCard(quiz.next());

            showResult();
        }, displayeTime);
    }

    let init = async () => {
        let data = await getData(quizUrl);
        resultData = await getData(resultUrl);

        document.getElementById('jumbotron-output').innerHTML = bsJumbotron(data.title, data.description);
        quiz = new Quiz(data.questions);
        renderQuestionCard(quiz.question);
        return 'Quiz initialized'
    }

    init().then(console.log).catch(console.log);

}());

// parcel module need to run async functions
import 'regenerator-runtime/runtime';

import { ajax, json } from './ajax';
import { bsAlert, bsCard, bsCheckbox, bsJumbotron, bsProgressBar, bsRadioButton } from './bs-components';
import { addClassById, answersContainer, getRandomNumber } from './helpers';
import Quiz from './quiz';


(function() {
    let quizUrl = 'https://proto.io/en/jobs/candidate-questions/quiz.json',
        resultUrl = 'https://proto.io/en/jobs/candidate-questions/result.json',
        output = document.getElementById('card-output'),
        displayeTime = 3000,// after user answer
        animations = ['lightSpeedIn', 'fadeInDownBig', 'bounceInDown', 'flipInY', 'rotateIn', 'slideInUp'],
        quiz,
        resultData;

    let getData = (url) => {
        return ajax(url).get().then(json);
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

    let renderQuestionCard = () => {
        let { img, title, question_type, possible_answers } = quiz.question;

        let answers = answerGenerator(question_type, possible_answers);

        let text = answersContainer(answers);
    
        output.innerHTML = bsCard(img, title, text, animation());
    }

    let highlighteCorrectAnswer = () => {
        let { correctAnswer } = quiz;

        document.querySelectorAll('input:checked').forEach(input => input.checked = false);

        if (Array.isArray(correctAnswer)) {
            return correctAnswer.forEach(id => addClassById(id, 'is-valid'));
        }

        addClassById(correctAnswer, 'is-valid');
    }

    let evaluateUserScore = ({ minpoints, maxpoints }) => {
        return quiz.userScore >= minpoints && quiz.userScore <= maxpoints;
    }
    // TODO: add restart button if user score less then 100
    let renderResultCard = (data) => {
        let { img, title, message } = data;
        let text = `${message} <p>your score is:</p> ${bsProgressBar(quiz.userScore)}`;
        output.innerHTML = bsCard(img, title, text, animation());
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
        document.querySelectorAll('input:checked')
        .forEach(input => answer.push(JSON.parse(input.value)));// conver strings to primitives
    
        if (answer.length < 2) return answer[0];
        return answer
    }

    let addClickEvent = () => {
        document.getElementById('nextQuestionBtn').addEventListener('click', onClick);
    }

    let onClick = (e) => {

        e.target.disabled = true;
        e.target.removeEventListener("click", onClick);

        let alertOutput = document.getElementById('alert-output');

        let userAnswer = getUserAnswer();

        if (quiz.validatedUserAnswer(userAnswer)) {
            alertOutput.innerHTML = bsAlert('success', 'Correct!', 'tada');
        } else {
            alertOutput.innerHTML = bsAlert('danger', 'Wrong!', 'shake');
            highlighteCorrectAnswer();
        }
    
        setTimeout(() => {
            if (quiz.hasNext) {
                renderQuestionCard(quiz.next());
                addClickEvent();
                return
            }
            showResult();
        }, displayeTime);
    }

    let init = async () => {
        let data = await getData(quizUrl);
        resultData = await getData(resultUrl);

        document.getElementById('jumbotron-output').innerHTML = bsJumbotron(data.title, data.description);

        quiz = new Quiz(data.questions);
        renderQuestionCard(quiz.question);
        addClickEvent();
        return 'Quiz initialized'
    }

    init().then(console.log).catch(console.log);

}());

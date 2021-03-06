export default (function(){
    let _userPoints = 0;
    let _questionIndex = 0;

    class Quiz {
        constructor(questions) {
            this.questions = questions;
        }

        get questionIndex() {
            return _questionIndex;
        }

        get userPoints() {
            return _userPoints;
        }
    
        get question() {
            return this.questions[this.questionIndex];
        }
    
        get correctAnswer() {
            return this.question.correct_answer;
        }
    
        get totalPoints() {
            return this.questions.map(question => question.points).reduce((sum, points) => sum + points, 0);
        }
    
        get userScore() {
            return Math.floor(this.userPoints / this.totalPoints * 100);
        }
    
        get progress() {
            return (this.questionIndex + 1) / this.questions.length * 100;
        }
    
        get hasNext() {
            return this.progress !== 100;
        }
    
        /**
         * @param {((number | boolean) | [number])} userAnswer - expects number or boolean or array of numbers.
         * @returns {boolean}
        */
        isCorrect(userAnswer) {  
            if (Array.isArray(userAnswer)) {
                return userAnswer.length === this.correctAnswer.length && userAnswer.every((answer) => this.correctAnswer.includes((answer)));
            }
        
            return this.correctAnswer === userAnswer;
        }
    
        validatedUserAnswer(userAnswer) {
            let result = this.isCorrect(userAnswer);
            if (result) {
                _userPoints += this.question.points;
            }
    
            return result
        }
    
        next() {
            _questionIndex ++;
            return this.question;
        }

        restart() {
            _questionIndex = 0;
            _userPoints = 0;
            return this.question;
        }
       
    }
    
    return Quiz

}());

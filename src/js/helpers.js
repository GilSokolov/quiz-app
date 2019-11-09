export function answersContainer(answers) {
    return `
    <span id="answers">
        <div style="min-height: 60px" id="alert-output"></div>
        ${answers}
        <button id="nextQuestionBtn" class="btn btn-primary btn-block mt-3">Next Question</button>
    </span>`;
}

export function addClassById(id, className) {
    let element = document.getElementById(id);
    element.classList.add(className);
}

export function getRandomNumber() {
    return Math.floor(Math.random() * 6 );
}

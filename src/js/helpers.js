import { bsProgressBar } from './bs-components';

export function answersContainer(answers) {
    return `
    <div style="min-height: 60px" class="alert-output"></div>
    <div class="answers">
        ${answers}
    </div>
    <span class="actionBtn"></span>`;
}

export function resultContainer(message, progressBar) {
    return `
    <p>${message}</p>
    <p>your score is:</p>
    ${progressBar}
    <span class="actionBtn"></span>`;
}

export function addClassById(id, className) {
    let element = document.getElementById(id);
    element.classList.add(className);
}
 /**
 * @param {number}
 * @returns {number} a number between 0 and the number supplied in the parameter.  
*/ 
export function getRandomNumber(number) {
    return Math.floor(Math.random() * number );
}

export function HTMLparser(text) {
    const html = new DOMParser().parseFromString( text , 'text/html');
    return html.body.firstChild; 
}

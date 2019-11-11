function bsCard(img, title, text, animation) {
    return `
    <div class="card animated ${animation}">
        <img src="${img}" class="card-img-top" alt="${title}">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <div class="card-text">${text}</div>
        </div>
    </div>`
}

function bsCheckbox(id, label) {
    return `
    <div class="custom-control custom-checkbox animated slideInLeft">
        <input type="checkbox" class="custom-control-input" value="${id}" id="${id}">
        <label class="custom-control-label" for="${id}">${label}</label>
    </div>`
}

function bsRadioButton(id, label) {
    return `
    <div class="custom-control custom-radio animated slideInLeft">
        <input type="radio" class="custom-control-input" name="customRadio" value="${id}" id="${id}">
        <label class="custom-control-label" for="${id}">${label}</label>
    </div>`
}

function bsJumbotron(title, description) {
    return `
    <div class="jumbotron jumbotron-fluid">
        <div class="container">
            <h1 class="display-4">${title}</h1>
            <p class="lead">${description}</p>
        </div>
    </div>`
}

function bsProgressBar(percent) {
    return `
    <div class="progress animated jackInTheBox slow">
        <div class="progress-bar" role="progressbar" style="width: ${percent}%;">${percent}%</div>
    </div>
    `
}

function bsAlert(type, text, animation) {
    return `
    <div class="alert alert-${type} animated ${animation}" role="alert">
        ${text}
    </div>`
}

function bsButton(text, type, event) {
    let btn = document.createElement('button');
    btn.classList.add('btn', 'btn-block', 'mt-3', type);
    btn.innerText = text;
    btn.addEventListener('click',event);
    return btn
}

export { bsCard, bsCheckbox, bsRadioButton, bsJumbotron, bsProgressBar, bsAlert, bsButton }

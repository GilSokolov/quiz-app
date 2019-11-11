function ajax(url) {

    let xhttp = new XMLHttpRequest();

    let onSuccess = (resolve) => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        return resolve(xhttp);
      }
    };

    let onError = (reject) => {
        return reject('** An error occurred during the transaction');
    }

    let send = (method, data) => {
        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = onSuccess.bind(this, resolve);
            xhttp.onerror = onError.bind(this, reject);

            if (data) xhttp.setRequestHeader("Content-Type", "application/json");

            xhttp.open(method, url);
            xhttp.send(data);
        });
    }

    let get = () => {
        return send('GET');
    }

    let post = (data) =>  {
        return send("POST", data);
    }

    return { get, post }
}

let json = (xhttp) => {
    return JSON.parse(xhttp.response);
}

export { ajax, json }

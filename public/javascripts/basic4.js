//====================================
//opponent文字列整形
//====================================


console.log("screen size : " + screen.width);

let strMinLength;

if (screen.width <= 480) {
    strMinLength = 8;
} else {
    strMinLength = 10;
}

let opponents = document.getElementsByClassName('p-opponent');
opponents = Array.from(opponents);

opponents.forEach(element => {
    let opponentStr = element.innerText;

    if (opponentStr.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) {
        if (opponentStr.length >= strMinLength) {
            opponentStr = opponentStr.slice(0, strMinLength - 2) + '...';
            element.innerText = opponentStr;
        };

    } else {
        if (opponentStr.length >= strMinLength) {
            opponentStr = opponentStr.slice(0, strMinLength - 1) + '...';
            element.innerText = opponentStr;
        };

    }

});

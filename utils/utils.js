function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getThreeRandomWordsFromArray(array) {
    let wordsArray = [];
    for (let i = 0; i < 3; i++) {
        let min = 0;
        let max = array.length;
        wordsArray.push(array[getRandomInt(min, max)]);
    }
    return wordsArray;
}

module.exports = {
    getThreeRandomWordsFromArray
};

/**
 * Gets a random number between a maximum and a minimum value.
 * @param {Number} min - Minimum possible value.
 * @param {Number} max - Maximum possible value.
 * @return {Number} The random number.
 */
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Gets a random integer between a maximum and a minimum value.
 * @param {Number} min - Minimum possible value (inclusive).
 * @param {Number} max - Maximum possible value (exclusive).
 * @return {Number} The random integer.
 */
function getRandInt(min, max) {
    max = Math.floor(max);
    min = Math.floor(min);
    return Math.floor(Math.random() * (max - min)) + min;
}

// utils/camelCase.js
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function keysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[toCamelCase(key)] = keysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

module.exports = { keysToCamelCase };
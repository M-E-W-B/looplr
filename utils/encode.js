const { escape } = require('querystring');

function encode(queryObj, nesting = '') {
  let queryString = '';

  const pairs = Object.entries(queryObj).map(([key, val]) => {
    // Handle the nested, recursive case, where the value to encode is an object itself
    if (typeof val === 'object') return encode(val, nesting + `${key}.`);
    // Handle base case, where the value to encode is simply a string.
    else return [nesting + key, val].map(escape).join('=');
  });

  return pairs.join('&');
}

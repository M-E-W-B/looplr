// Refer: https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947

const { createError } = require('apollo-errors');

module.exports.ListFetchError = createError('ListFetchError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.ItemDoesNotExistError = createError('ItemDoesNotExistError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.ItemFetchError = createError('ItemFetchError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.CreateError = createError('CreateError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.UpdateError = createError('UpdateError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.DeleteError = createError('DeleteError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.ValidationError = createError('ValidationError', {
  message: '',
  showPath: true,
  showLocations: true
});

module.exports.UnknownError = createError('UnknownError', {
  message: 'Something has gone wrong on the server.',
  showPath: true,
  showLocations: true
});
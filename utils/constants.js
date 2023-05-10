const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CREATED: 201,
  UNAUTHORIZED: 401,
};

/* eslint-disable no-useless-escape */
const URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = { ERROR_CODES, URL_REGEXP };

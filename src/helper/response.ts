/**
 * @param {Number} statusCode - status code of the response
 * @param {string} message - message identify the code
 * @param {{}} payload - response object
 * @param {Error} error - error message
 * @param {Token} token - jwt token
 * @returns {{}}
 */

export default function(statusCode: number, message: string, payload: object | null, error?: string | null) {
  return {
    statusCode,
    message,
    payload,
    error,
  };
}

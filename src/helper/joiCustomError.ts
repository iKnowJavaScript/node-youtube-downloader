/**
 * Returns a custom error object with descriptive messages.
 * @property {Array} arr - Array of Joi validation errors.
 * @returns {Object}
 */
export const customErrorMessage = (arr: any): string => {
  const errMessage: any = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i].path[0];
    const message = arr[i].message;
    if (!errMessage[key]) {
      errMessage[key] = message.replace(/["']/g, "");
    }
  }

  return errMessage;
};

export const isJoiError = (err: any) => {
  if (err != null && err["details"]) {
    return !Array.isArray(err["details"]) ? false : err["details"][0].message.includes("required") ? true : false;
  }
  return false;
};

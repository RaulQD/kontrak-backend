export const changeStringToDate = (date: string) => {
  const fechaString = date.split('/');

  return new Date(+fechaString[2], +fechaString[1] - 1, +fechaString[0]);
};

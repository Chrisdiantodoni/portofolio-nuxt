export const onlyNumber = (e: KeyboardEvent) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};

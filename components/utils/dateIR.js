export const dateIR = (date) => {
  const dateParts = date.split("T")[0];
  const newDate = new Date(dateParts);
  const option = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return newDate.toLocaleString("fa-IR", option);
};
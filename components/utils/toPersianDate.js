export const toPersianDate = (date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
};
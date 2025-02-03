export const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};
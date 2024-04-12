export const converter = (price: string) => {
  let IndianRupee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return IndianRupee.format(parseFloat(price));
};

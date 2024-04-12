export const converter = (price: number) => {
  let IndianRupee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return IndianRupee.format(price);
};

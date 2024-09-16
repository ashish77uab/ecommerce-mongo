const devEnv = process.env.NODE_ENV !== "production";


export const imageRender = (url) => {
  return `${url}`;
};
export const numberWithCommas = (number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 20,
  }).format(number);
};

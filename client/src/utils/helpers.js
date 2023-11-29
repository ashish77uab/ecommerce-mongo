const devEnv = process.env.NODE_ENV !== "production";

const { REACT_APP_DEV_API, REACT_APP_PROD_API } = process.env;

export const imageRender = (url) => {
  return `${devEnv ? REACT_APP_DEV_API : REACT_APP_PROD_API}${url}`;
};
export const numberWithCommas = (number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 20,
  }).format(number);
};

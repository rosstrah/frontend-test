import { PASSWORD_CHARSET } from "./const";

export const generatePassword = (length = 10) => {
  const charset = PASSWORD_CHARSET;
  let result = "";

  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return result;
};

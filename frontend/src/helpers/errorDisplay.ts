import axios, { AxiosError } from "axios";

export const queryError = (error: AxiosError) => {
  // Shows query error on development only
  if (axios.isAxiosError(error) && process.env.NODE_ENV == "development")
    console.error(error.response?.data);
};

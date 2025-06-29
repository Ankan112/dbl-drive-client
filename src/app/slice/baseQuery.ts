import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { setLogout } from "../features/userSlice";
import { RootState } from "../store/store";

const baseURL = "http://localhost:3003/api/v1";

export const socket_url = "https://test.socket.com";
export const DownloadURL = "http://localhost:3003"; //! avoid / end of the line otherwise image and pdf won't work!

export const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).userSlice.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});
export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    // result?.error?.status === 400 ||
    result?.error?.status === 401 ||
    result?.error?.status === "CUSTOM_ERROR" ||
    result?.error?.status === "FETCH_ERROR" ||
    result?.error?.status === "PARSING_ERROR" ||
    result?.error?.status === "TIMEOUT_ERROR"
  ) {
    api.dispatch(setLogout());
  }

  return result;
};

import { api } from "../../app/api/api";
import { HTTPResponse } from "../../app/types/commonTypes";
import { IAccountHead } from "../types/CommonTypes";

export const CommonEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAccountHeadSelect: build.query<HTTPResponse<IAccountHead[]>, void>({
      query: () => {
        return {
          url: `/account/head/select`,
        };
      },
    }),
  }),
});

export const { useGetAccountHeadSelectQuery } = CommonEndPoint;

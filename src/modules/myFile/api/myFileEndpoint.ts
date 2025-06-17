import { message } from "antd";
import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IMyFileList } from "../types/myFileTypes";

export const myFileEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    // createFolder: build.mutation<HTTPResponse<void>, number>({
    //   query: (body) => ({
    //     url: "/folder/add",
    //     method: "POST",
    //     body: body,
    //   }),
    //   onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
    //     asyncWrapper(async () => {
    //       message.success("Successfully Folder Created!");
    //     });
    //   },
    //   invalidatesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    // }),
    getMyFileList: build.query<HTTPResponse<IMyFileList[]>, void>({
      query: () => ({
        url: `/file/my-list`,
      }),
      providesTags: () => [{ type: "myFileTypes", id: "myFile" }],
    }),
  }),
});

export const { useGetMyFileListQuery } = myFileEndpoint;

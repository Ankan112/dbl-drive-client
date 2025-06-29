import { message } from "antd";
import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IMyFileList, IPaginationParams } from "../types/myFileTypes";

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
    getMyFileList: build.query<HTTPResponse<IMyFileList[]>, IPaginationParams>({
      query: (params) => ({
        url: `/file/my-list`,
        params,
      }),
      providesTags: () => [{ type: "myFileTypes", id: "myFile" }],
    }),
  }),
});

export const { useGetMyFileListQuery } = myFileEndpoint;

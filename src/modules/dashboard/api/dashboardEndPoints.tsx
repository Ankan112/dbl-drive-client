import { message } from "antd";
import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  ICreateFolder,
  IFileAndFolderList,
  IFolderDetails,
  IFolderList,
} from "../types/dashboardTypes";

export const dashboardEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    createFolder: build.mutation<HTTPResponse<void>, ICreateFolder>({
      query: (body) => ({
        url: "/folder/add",
        method: "POST",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully Folder Created!");
        });
      },
      invalidatesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getFolderList: build.query<HTTPResponse<IFolderList[]>, void>({
      query: () => ({
        url: `/folder/list`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getFolderDetails: build.query<HTTPResponse<IFolderDetails>, number>({
      query: (id) => ({
        url: `/folder/details/${id}`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getFileAndFolderList: build.query<HTTPResponse<IFileAndFolderList[]>, void>(
      {
        query: () => ({
          url: `/file/list`,
        }),
        providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
      }
    ),
    uploadFiles: build.mutation<HTTPResponse<void>, FormData>({
      query: (body) => ({
        url: "/file/upload-file",
        method: "POST",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully files Uploaded!");
        });
      },
      invalidatesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
  }),
});

export const {
  useCreateFolderMutation,
  useGetFolderDetailsQuery,
  useGetFolderListQuery,
  useGetFileAndFolderListQuery,
  useUploadFilesMutation,
} = dashboardEndpoints;

import { message } from "antd";
import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  ICreateFolder,
  IFileAndFolderList,
  IFileDetails,
  IFolderDetails,
  IFolderList,
} from "../types/dashboardTypes";
import { IPaginationParams } from "../../myFile/types/myFileTypes";

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
      invalidatesTags: () => [
        { type: "dashboardTypes", id: "dashboard" },
        { type: "myFileTypes", id: "myFile" },
      ],
    }),
    updateFileName: build.mutation<
      HTTPResponse<void>,
      { body: { name: string }; id: number }
    >({
      query: ({ body, id }) => ({
        url: `/file/update/${id}`,
        method: "PUT",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully File Renamed!");
        });
      },
      invalidatesTags: () => [
        { type: "dashboardTypes", id: "dashboard" },
        { type: "myFileTypes", id: "myFile" },
      ],
    }),
    updateFolderName: build.mutation<
      HTTPResponse<void>,
      { body: { name: string }; id: number }
    >({
      query: ({ body, id }) => ({
        url: `/folder/update/${id}`,
        method: "PUT",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully Folder Renamed!");
        });
      },
      invalidatesTags: () => [
        { type: "dashboardTypes", id: "dashboard" },
        { type: "myFileTypes", id: "myFile" },
      ],
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
    getFileDetails: build.query<HTTPResponse<IFileDetails>, number>({
      query: (id) => ({
        url: `/file/details/${id}`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getFileAndFolderList: build.query<
      HTTPResponse<IFileAndFolderList[]>,
      IPaginationParams
    >({
      query: (params) => ({
        url: `/file/list`,
        params,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    uploadFiles: build.mutation<HTTPResponse<void>, FormData>({
      query: (body) => ({
        url: "/file/upload-file",
        method: "POST",
        body: body,
      }),
      
      invalidatesTags: () => [
        { type: "dashboardTypes", id: "dashboard" },
        { type: "myFileTypes", id: "myFile" },
      ],
    }),
  }),
});

export const {
  useCreateFolderMutation,
  useGetFolderDetailsQuery,
  useGetFileDetailsQuery,
  useLazyGetFileDetailsQuery,
  useGetFolderListQuery,
  useGetFileAndFolderListQuery,
  useUploadFilesMutation,
  useUpdateFileNameMutation,
  useUpdateFolderNameMutation,
} = dashboardEndpoints;

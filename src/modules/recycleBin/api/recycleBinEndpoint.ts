import { message } from "antd";
import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IRecycleBin, IRecycleBinList } from "../types/RecycleBinTypes";
import { IPaginationParams } from "../../myFile/types/myFileTypes";

export const recycleBinEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    moveToRecycleBin: build.mutation<HTTPResponse<void>, IRecycleBin>({
      query: (body) => ({
        url: "/file/file-temporary-delete",
        method: "PUT",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully File Deleted!");
        });
      },
      invalidatesTags: () => [
        { type: "recycleBinList", id: "recycle" },
        { type: "myFileTypes", id: "myFile" },
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    restoreFile: build.mutation<HTTPResponse<void>, IRecycleBin>({
      query: (body) => ({
        url: "/file/file-restore",
        method: "PUT",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully File Restored!");
        });
      },
      invalidatesTags: () => [
        { type: "recycleBinList", id: "recycle" },
        { type: "myFileTypes", id: "myFile" },
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    permanentDeleteFile: build.mutation<HTTPResponse<void>, IRecycleBin>({
      query: (body) => ({
        url: "/file/permanent-delete",
        method: "DELETE",
        body: body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          message.success("Successfully File Permanently Deleted!");
        });
      },
      invalidatesTags: () => [
        { type: "recycleBinList", id: "recycle" },
        { type: "myFileTypes", id: "myFile" },
      ],
    }),
    getRecycleBinList: build.query<
      HTTPResponse<IRecycleBinList[]>,
      IPaginationParams
    >({
      query: (params) => ({
        url: `/file/recycle-bin-list`,
        params,
      }),
      providesTags: () => [{ type: "recycleBinList", id: "recycle" }],
    }),
  }),
});

export const {
  useGetRecycleBinListQuery,
  useMoveToRecycleBinMutation,
  useRestoreFileMutation,
  usePermanentDeleteFileMutation,
} = recycleBinEndpoint;

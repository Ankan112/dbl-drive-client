/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "../app/api/api";
import notification from "../common/utils/Notification";
import asyncWrapper from "../utils/asyncWrapper";

export const forgetPassEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    getOTP: build.mutation<void, any>({
      query: (body) => ({
        url: `/authentication/send-otp`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully OTP Send");
        });
      },
    }),

    matchOtp: build.mutation<any, any>({
      query: (body) => ({
        url: `/authentication/verify-otp`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully OTP Match");
        });
      },
    }),

    resetPassword: build.mutation<any, any>({
      query: ({ body, headers }) => ({
        url: `/authentication/reset-password`,
        method: "POST",
        body: body,
        headers,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully change password");
        });
      },
    }),

    changePassword: build.mutation<any, any>({
      query: (body) => ({
        url: `/profile/change-password`,
        method: "PUT",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully password changed");
        });
      },
    }),
  }),
});

export const {
  useGetOTPMutation,
  useMatchOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = forgetPassEndpoint;

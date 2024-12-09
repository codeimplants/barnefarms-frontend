
import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl:BASE_URL,
  prepareHeaders: (headers) => {  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token: string | null = userInfo ? userInfo.token : null;
    console.log(token)
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      console.log("Authorization Header Set:", headers); // Log to verify the header
    }
  
    return headers;
  }
})
export const apiSlice = createApi({
  baseQuery,
  tagTypes:['Product','Order','User'],
  endpoints:()=>({})
 });

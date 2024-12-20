
import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../constants"; // localhost backend link
// import { BASE_URL } from "../constants"; //hosted backend  link on render

const baseQuery = fetchBaseQuery({
  baseUrl:BACKEND_URL,
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

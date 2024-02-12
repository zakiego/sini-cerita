"use server";

import { headers } from "next/headers";

export const getIp = () => {
  const ip = headers().get("x-forwarded-for");
  return ip;
};

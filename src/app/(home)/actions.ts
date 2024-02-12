"use server";

import { client } from "@/app/lib/db";
import { getIp } from "@/app/lib/ip";
import { revalidatePath } from "next/cache";

export const addStory = async (content: string) => {
  const ip = getIp();

  console.log("IP Address:", ip);

  const time = new Date().toISOString();

  const data = {
    content,
    timestamp: time,
  };

  await client.lpush("stories-dev", JSON.stringify(data));

  revalidatePath("/");
};

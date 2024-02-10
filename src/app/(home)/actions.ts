"use server";

import { client } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export const addStory = async (content: string) => {
  const time = new Date().toISOString();

  const data = {
    content,
    timestamp: time,
  };

  await client.lpush("stories", JSON.stringify(data));

  revalidatePath("/");
};

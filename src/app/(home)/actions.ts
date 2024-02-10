"use server";

import { client } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export const addStory = async (content: string) => {
	const time = new Date().toISOString();

	await client.lpush("stories", content);
	await client.lpush("stories-timestamps", time);

	revalidatePath("/");
};

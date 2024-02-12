import { Feeds } from "@/app/(home)/@components/feeds";
import { LayoutPage } from "@/app/(home)/@components/layout-page";
import { client } from "@/app/lib/db";
import { formatDateDifference } from "@/app/lib/utils";
import { Metadata } from "next";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Sini Cerita",
  description: "Hai, gimana harimu? Ada cerita apa hari ini? 🤗"
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const stories = await client.lrange("stories", 0, -1);

  const schema = z.object({
    content: z.string(),
    timestamp: z.string(),
  });
  const parsedData = stories.map((story) => {
    const data = schema.parse(JSON.parse(story));
    const readableTimestamp = formatDateDifference(data.timestamp);

    return {
      content: data.content,
      timestamp: data.timestamp,
      readableTimestamp,
    };
  });

  return (
    <LayoutPage>
      <Feeds stories={parsedData} />
    </LayoutPage>
  );
}

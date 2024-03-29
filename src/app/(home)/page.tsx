import { Feeds } from "@/app/(home)/@components/feeds";
import { LayoutPage } from "@/app/(home)/@components/layout-page";
import { client } from "@/app/lib/db";
import { formatDateDifference } from "@/app/lib/utils";
import { Metadata } from "next";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Sini Cerita",
  description: "Hai, gimana harimu? Ada cerita apa hari ini? 🤗",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // stories --> before cleaning
  // stories-prod --> current stories
  // stories-backup --> backup stories from stories
  const stories = await client.lrange("stories-prod", 0, -1);

  // backup to 'stories-prod' but reverse
  // await client.lpush("stories-prod", ...stories.reverse());

  // delete all stories
  // await client.ltrim("stories-backup", 0, -1);

  // backup stories
  // await client.lpush("stories-backup", ...stories);

  // delete from index 131 until 1237
  // await client.ltrim("stories-backup", 0, 130);

  const schema = z.object({
    content: z.string(),
    timestamp: z.string(),
  });

  const parsedData = stories
    .map((story) => {
      const data = schema.parse(JSON.parse(story));
      const readableTimestamp = formatDateDifference(data.timestamp);

      return {
        content: data.content,
        timestamp: data.timestamp,
        readableTimestamp,
      };
    })
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <LayoutPage>
      <Feeds stories={parsedData} />
    </LayoutPage>
  );
}

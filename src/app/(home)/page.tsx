import { Feeds } from "@/app/(home)/@components/feeds";
import { LayoutPage } from "@/app/(home)/@components/layout-page";
import { client } from "@/app/lib/db";
import { Metadata } from "next";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Sini Cerita",
  description: "Sini cerita masalahmu, kamu nggak sendiri",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const stories = await client.lrange("stories", 0, -1);

  const schema = z.object({
    content: z.string(),
    timestamp: z.string(),
  });
  const parsedData = stories
    .map((story) => schema.parse(JSON.parse(story)))
    .map((story) => ({
      content: story.content,
      timestamp: story.timestamp,
      readableTimestamp: formatDateDifference(story.timestamp),
    }));

  return (
    <LayoutPage>
      <Feeds stories={parsedData} />
    </LayoutPage>
  );
}

function formatDateDifference(inputDate: string): string {
  const date = new Date(inputDate);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();

  // Function to convert milliseconds to human-readable time
  const msToTime = (duration: number): string => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(duration / (1000 * 60 * 60 * 24 * 7));
    const years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365));

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (seconds > 0) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;

    return "just now";
  };

  return msToTime(timeDifference);
}

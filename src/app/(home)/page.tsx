import { Feeds } from "@/app/(home)/@components/feeds";
import { LayoutPage } from "@/app/(home)/@components/layout-page";
import { client } from "@/app/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sini Cerita",
	description: "Sini cerita masalahmu, kamu nggak sendiri",
};

export default async function Home() {
	const stories = await client.lrange("stories", 0, -1);
	const timestamps = await client.lrange("stories-timestamps", 0, -1);

	const data = stories.map((content, i) => ({
		content,
		timestamp: timestamps[i],
	}));

	return (
		<LayoutPage>
			<Feeds stories={data} />
		</LayoutPage>
	);
}

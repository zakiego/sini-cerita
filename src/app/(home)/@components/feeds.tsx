"use client";

/* eslint-disable @next/next/no-img-element */
import { Toaster, toast } from "sonner";

import clsx from "clsx";
import { Avatar } from "@/app/components/avatar";
import { addStory } from "@/app/(home)/actions";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/button";

interface Props {
	stories: {
		content: string;
		timestamp: string;
		readableTimestamp: string;
	}[];
}

export const Feeds = ({ stories }: Props) => {
	const { register, handleSubmit, reset } = useForm();

	const onSubmit = handleSubmit(async (data) => {
		await addStory(data.content);
		toast.success("Makasih ya udah cerita!");
		reset();
	});

	return (
		<>
			<Toaster richColors />

			<h1 className="text-lg font-semibold text-gray-900 sm:text-xl sm:leading-7 sm:truncate">
				Lagi ada masalah apa nih? ☹️
			</h1>

			<div className="mt-6 flex gap-x-3 pb-7">
				<form onSubmit={onSubmit} className="relative flex-auto">
					<div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-gray-600">
						<label htmlFor="content" className="sr-only">
							Sini ceritain masalahnya...
						</label>
						<textarea
							rows={2}
							className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
							placeholder="Sini ceritain masalahnya..."
							{...register("content")}
						/>
					</div>

					<div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
						<Button color="white" type="submit">
							Sampaikan
						</Button>
					</div>
				</form>
			</div>

			<ul className="space-y-6">
				{stories.map((activityItem, activityItemIdx) => (
					<li key={activityItem.timestamp} className="relative flex gap-x-4">
						<div
							className={clsx(
								activityItemIdx === stories.length - 1 ? "h-6" : "-bottom-6",
								"absolute left-0 top-0 flex w-6 justify-center",
							)}
						>
							<div className="w-px bg-gray-200" />
						</div>
						<>
							<Avatar
								alt=""
								className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-100"
							/>
							<div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
								<div className="flex justify-between gap-x-4">
									<div className="py-0.5 text-xs leading-5 text-gray-500">
										<span className="font-medium text-gray-900">Anonim</span>{" "}
										commented
									</div>
									<time
										dateTime={activityItem.timestamp}
										className="flex-none py-0.5 text-xs leading-5 text-gray-500"
									>
										{activityItem.readableTimestamp}
									</time>
								</div>
								<p className="text-sm leading-6 text-gray-500">
									{activityItem.content}
								</p>
							</div>
						</>
					</li>
				))}
			</ul>
		</>
	);
};

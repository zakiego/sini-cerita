"use client";

/* eslint-disable @next/next/no-img-element */
import { Toaster, toast } from "sonner";

import clsx from "clsx";
import { Avatar } from "@/app/components/avatar";
import { addStory } from "@/app/(home)/actions";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

interface Props {
  stories: {
    content: string;
    timestamp: string;
    readableTimestamp: string;
  }[];
}

export const Feeds = ({ stories }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(
      z.object({
        content: z.string().trim().min(3).max(100),
      }),
    ),
  });

  const onSubmit = handleSubmit(async (data) => {
    await addStory(data.content.trim());
    toast.success("Makasih ya udah cerita!");
    reset();
  });

  const maxContentLength = 100;
  const [isExpanded, setIsExpanded] = useState<boolean[]>(
    Array(stories.length).fill(false),
  );

  const toggleExpand = (index: number) => {
    const newExpanded = [...isExpanded];
    newExpanded[index] = !newExpanded[index];
    setIsExpanded(newExpanded);
  };

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
              disabled={formState.isSubmitting}
              {...register("content")}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
            <Button
              color="white"
              type="submit"
              className="!text-xs"
              disabled={
                formState.isSubmitting ||
                !formState.isDirty ||
                !formState.isValid
              }
            >
              {formState.isSubmitting ? "Loading..." : "Sampaikan"}
            </Button>
          </div>
        </form>
      </div>

      <ul className="space-y-6">
        {stories.map((activityItem, activityItemIdx) => {
          const contentLength = activityItem.content.length;
          const isContentLong = contentLength > maxContentLength;
          const isExpandedItem = isExpanded[activityItemIdx];
          const isLastItem = activityItemIdx === stories.length - 1;

          return (
            <li key={activityItem.timestamp} className="relative flex gap-x-4">
              <div
                className={clsx(
                  isLastItem ? "h-6" : "-bottom-6",
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
                      suppressHydrationWarning
                    >
                      {activityItem.timestamp}
                    </time>
                  </div>
                  {!isContentLong && (
                    <p className="text-sm leading-6 text-gray-500 break-all">
                      {activityItem.content}
                    </p>
                  )}
                  {isContentLong && !isExpandedItem && (
                    <p className="text-sm leading-6 text-gray-500 break-all">
                      {activityItem.content.slice(0, maxContentLength)} ...{" "}
                      <button
                        type="button"
                        className="text-blue-500"
                        onClick={() => toggleExpand(activityItemIdx)}
                      >
                        baca selengkapnya
                      </button>
                    </p>
                  )}
                  {isContentLong && isExpandedItem && (
                    <p className="text-sm leading-6 text-gray-500 break-all">
                      {activityItem.content}
                    </p>
                  )}
                </div>
              </>
            </li>
          );
        })}
      </ul>
    </>
  );
};

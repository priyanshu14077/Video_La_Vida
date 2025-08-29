"use client";

import VideoComponent from "./VideoComponent";
import { VideoType } from "@/types/video";

interface VideoFeedProps {
  videos: VideoType[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="min-h-screen py-8 px-2 sm:px-6 lg:px-12 bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {videos.map((video) => (
          <VideoComponent key={video.id?.toString()} video={video} />
        ))}

        {videos.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-base-content/70">No videos found</p>
          </div>
        )}
      </div>
    </div>
  );
}
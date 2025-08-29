"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { VideoType } from "@/types/video";
import { motion } from "framer-motion";

export default function VideoComponent({ video }: { video: VideoType }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleThumbnailClick = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      <div className="relative aspect-video bg-gray-800">
        {!showVideo ? (
          // Thumbnail view
          <div className="relative w-full h-full cursor-pointer" onClick={handleThumbnailClick}>
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/225';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No thumbnail available</p>
                </div>
              </div>
            )}
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Play className="w-8 h-8 text-white" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          // Video view
          <video
            src={video.videoUrl}
            controls={video.controls}
            autoPlay={isPlaying}
            className="w-full h-full object-cover"
            onError={() => {
              setShowVideo(false);
              setIsPlaying(false);
            }}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>By {video.user?.name || video.user?.email?.split('@')[0] || 'Anonymous'}</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
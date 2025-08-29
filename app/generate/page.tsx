"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Video, Wand2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface VideoData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
  };
}

interface GenerateVideoData {
  prompt: string;
  style: string;
  duration: number;
}

function GenerateVideoPage() {
  const { data: session, status } = useSession();
  const [generateData, setGenerateData] = useState<GenerateVideoData>({
    prompt: "",
    style: "cinematic",
    duration: 5,
  });
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGenerateData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!generateData.prompt.trim()) {
      setError("Please enter a video prompt");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // First, generate the video concept
      const generateResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateData),
      });

      const generateResult = await generateResponse.json();

      if (!generateResponse.ok) {
        throw new Error(generateResult.error || 'Failed to generate video');
      }

      setGeneratedVideo(generateResult.video);

      // Then save to database
      const saveResponse = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: generateResult.video.title,
          description: generateResult.video.description,
          videoUrl: generateResult.video.videoUrl,
          thumbnailUrl: generateResult.video.thumbnailUrl,
        }),
      });

      if (!saveResponse.ok) {
        const saveResult = await saveResponse.json();
        throw new Error(saveResult.error || 'Failed to save video');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setGeneratedVideo(null);
    setGenerateData({
      prompt: "",
      style: "cinematic",
      duration: 5,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm mb-6">
              <span>Home</span>
              <span>/</span>
              <span>AI Suite</span>
              <span>/</span>
              <span className="text-white">Generate Video</span>
            </div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-white to-gray-200 rounded-2xl mb-8"
            >
              <Wand2 className="w-10 h-10 text-black" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generate AI Video
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into stunning videos with our advanced AI technology. Simply describe your vision and watch it come to life.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {!success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Video</h2>
              <p className="text-gray-400">Describe your vision and let AI bring it to life</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Prompt Input */}
              <div className="space-y-3">
                <label htmlFor="prompt" className="block text-lg font-semibold text-white">
                  Video Description *
                </label>
                <p className="text-sm text-gray-400">
                  Be specific about scenes, actions, style, and mood for best results
                </p>
                <textarea
                  id="prompt"
                  name="prompt"
                  value={generateData.prompt}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none text-base"
                  placeholder="Example: A serene sunset over a mountain lake with birds flying across the sky, cinematic lighting, peaceful atmosphere, golden hour, reflections on water..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Style Selection */}
                <div className="space-y-3">
                  <label htmlFor="style" className="block text-lg font-semibold text-white">
                    Video Style
                  </label>
                  <div className="relative">
                    <select
                      id="style"
                      name="style"
                      value={generateData.style}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all appearance-none cursor-pointer text-base"
                    >
                      <option value="cinematic">🎬 Cinematic</option>
                      <option value="documentary">📹 Documentary</option>
                      <option value="animated">🎨 Animated</option>
                      <option value="artistic">🖼️ Artistic</option>
                      <option value="realistic">📷 Realistic</option>
                      <option value="fantasy">✨ Fantasy</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="space-y-3">
                  <label htmlFor="duration" className="block text-lg font-semibold text-white">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      id="duration"
                      name="duration"
                      value={generateData.duration}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all appearance-none cursor-pointer text-base"
                    >
                      <option value={3}>⚡ 3 seconds</option>
                      <option value={5}>🎯 5 seconds</option>
                      <option value={10}>📺 10 seconds</option>
                      <option value={15}>🎪 15 seconds</option>
                      <option value={30}>🎭 30 seconds</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={generating}
                  whileHover={{ scale: generating ? 1 : 1.02 }}
                  whileTap={{ scale: generating ? 1 : 0.98 }}
                  className="w-full bg-white text-black py-5 px-8 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating Your Video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate AI Video
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Video Generated Successfully!</h3>
            <p className="text-gray-400 mb-8">Your AI-generated video has been created and saved to your collection.</p>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="bg-gray-700 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Generate Another
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/explore"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                View Collection
              </motion.a>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default GenerateVideoPage;

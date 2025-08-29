"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, Sparkles, Upload, Eye, Zap, Users } from "lucide-react";
import Link from "next/link";
import VideoFeed from "./components/VideoFeed";
import HeroSection from "./components/HeroSection";
import { VideoType } from "@/types/video";

function HomePage() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestVideos();
  }, []);

  const fetchLatestVideos = async () => {
    try {
      const response = await fetch('/api/video');
      const data = await response.json();
      
      if (response.ok) {
        // Get latest 8 videos for homepage
        setVideos(data.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <HeroSection
        title="AI Video Generator"
        subtitle="AI Video Generator"
        description="Generate high-quality videos with a prompt or an image, choosing from multiple generation models. Type your scene or upload an image generated with our AI tools or from your gallery."
        primaryAction={{
          text: "Generate AI video",
          href: "/generate"
        }}
        secondaryAction={{
          text: "Watch Demo",
          href: "/explore"
        }}
        backgroundImage="https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
        showBrands={true}
      />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How it Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of video creation with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate high-quality videos in minutes, not hours. Our AI processes your requests instantly."
              },
              {
                icon: Eye,
                title: "Stunning Quality",
                description: "Create professional-grade videos with advanced AI models and customizable parameters."
              },
              {
                icon: Users,
                title: "Easy to Use",
                description: "No technical expertise required. Simply describe your vision and let AI bring it to life."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Feed Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Latest Creations</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover amazing AI-generated videos from our community
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <VideoFeed videos={videos} />
          )}
          
          <div className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/explore"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <Eye className="w-5 h-5 mr-2" />
                Explore All Videos
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative z-10 text-center py-8 text-gray-500 text-sm"
      >
        &copy; {new Date().getFullYear()} AI Video Generator. All rights reserved.
      </motion.footer>
    </div>
  );
}

export default HomePage;

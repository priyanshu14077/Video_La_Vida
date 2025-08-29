"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Video, X, CheckCircle, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl?: string;
}

function VideoUploadForm() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Get ImageKit auth parameters
      const authResponse = await fetch('/api/imagekit-auth');
      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.error || 'Failed to get upload authorization');
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('publicKey', authData.publicKey);
      formData.append('signature', authData.authenticationParameters.signature);
      formData.append('expire', authData.authenticationParameters.expire.toString());
      formData.append('token', authData.authenticationParameters.token);
      formData.append('fileName', file.name);
      formData.append('folder', '/videos');
      
      // Add video transformation parameters for thumbnail generation
      formData.append('transformation', JSON.stringify({
        post: [
          {
            type: 'thumbnail',
            value: 'w-400,h-300,c-at_max,q-80'
          }
        ]
      }));
      formData.append('responseFields', 'thumbnailUrl,url,fileId,name');

      // Upload to ImageKit
      const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.message || 'Upload failed');
      }

      // Generate thumbnail URL from video URL
      let thumbnailUrl = uploadResult.thumbnailUrl;
      if (!thumbnailUrl && uploadResult.url) {
        // Create thumbnail URL using ImageKit video thumbnail transformation
        thumbnailUrl = uploadResult.url.replace(/\.[^.]+$/, '') + '.jpg?tr=w-400,h-300,c-at_max,q-80,so-5';
      }
      
      // Fallback to placeholder if no thumbnail
      if (!thumbnailUrl) {
        thumbnailUrl = '/api/placeholder/400/300';
      }

      setUploadedVideo({
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        name: uploadResult.name,
        thumbnailUrl: thumbnailUrl
      });
      
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedVideo(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Video className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Upload Video</h2>
          <p className="text-gray-400">Upload your video to generate AI-powered content</p>
        </div>

        {!uploadedVideo ? (
          <div className="space-y-6">
            {/* File Upload Area */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                {file ? file.name : 'Click to select video file'}
              </p>
              <p className="text-gray-400 text-sm">
                Supports MP4, MOV, AVI and other video formats
              </p>
            </motion.div>

            {/* Upload Button */}
            {file && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Video
                  </>
                )}
              </motion.button>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        ) : (
          /* Upload Success */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Successful!</h3>
              <p className="text-gray-400">Your video has been uploaded successfully</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 text-left">
              <p className="text-sm text-gray-400 mb-2">Video Details:</p>
              <p className="text-white font-medium">{uploadedVideo.name}</p>
              <p className="text-gray-400 text-sm mt-1">File ID: {uploadedVideo.fileId}</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetUpload}
                className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Upload Another
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/generate"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all text-center"
              >
                Generate Video
              </motion.a>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default VideoUploadForm;
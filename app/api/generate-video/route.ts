import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, style = "cinematic", duration = 5 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Generate realistic video URLs using sample content
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use sample video URLs that actually exist
    const sampleVideos = [
      {
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=AI+Generated+Video"
      },
      {
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://via.placeholder.com/400x300/2a2a2a/ffffff?text=Big+Bunny"
      },
      {
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://via.placeholder.com/400x300/3a3a3a/ffffff?text=Elephants+Dream"
      }
    ];
    
    const selectedVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    const videoUrl = selectedVideo.videoUrl;
    const thumbnailUrl = selectedVideo.thumbnailUrl;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      video: {
        id: videoId,
        videoUrl,
        thumbnailUrl,
        title: ` ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`,
        description: ` "${prompt}" with ${style} style (${duration}s duration)`,
        duration,
        style,
        prompt
      }
    });

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}

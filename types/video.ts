
export interface VideoType {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  transformation?: {
    id: number;
    height: number;
    width: number;
    quality: number | null;
    videoId: number | null;
  };
  user?: {
    id: number;
    name: string | null;
    email: string;
  };
}

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

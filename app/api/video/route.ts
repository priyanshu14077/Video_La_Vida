import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
         const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                transformation: true
            }
         });

         return NextResponse.json(videos, { status: 200 });

    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (
            !body.title ||
            !body.videoUrl ||
            !body.thumbnailUrl ||
            !body.description
        ) {
            return NextResponse.json({ error: "Missing Required Fields" }, { status: 400 });
        }

        const newVideo = await prisma.video.create({
            data: {
                title: body.title,
                description: body.description,
                videoUrl: body.videoUrl,
                thumbnailUrl: body.thumbnailUrl,
                controls: body.controls ?? true,
                userId: parseInt(session.user.id),
                transformation: {
                    create: {
                        height: body.transformation?.height ?? 1920,
                        width: body.transformation?.width ?? 1080,
                        quality: body.transformation?.quality ?? 100
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                transformation: true
            }
        });

        return NextResponse.json(newVideo, { status: 201 });
        
    } catch(error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }
}
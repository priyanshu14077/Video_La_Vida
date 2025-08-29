"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess: (response: any) => void;
    onProgress: (progress: number) => void;
    fileType?: "image" | "video"
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}:  FileUploadProps) => {
    
    const [uploading, setUploading] = useState(false);
    const [error , setError] = useState<string | null>(null);
    
    // optional validation 

    const validateFile = (file : File) => {
        if (fileType === "video"){
            if(!file.type.startsWith("video/")) {
                setError("Please upload a valid video file.");
        }
    }
    if (file.size > 100*1024*1024) {
        setError("File size exceeds 100MB limit.");
    }
    return true;
}

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !validateFile(file)) return 

    setUploading(true)
    setError(null);
    try {
       const authRes= await  fetch ("/api/auth/imagekit-auth")
       const auth = await authRes.json();

       const res = await upload ({
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        onProgress(percent);
                    }
                },
            });
            onSuccess(res);
    } catch (error) {
        console.error("Upload failed:", error);

    }  finally {
        setUploading(false);
    }
}  
    return (
        <div className="w-full max-w-md mx-auto rounded-2xl bg-white/10 dark:bg-black/30 shadow-lg backdrop-blur-md p-8 flex flex-col items-center gap-4">
            <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer py-8 hover:bg-white/20 dark:hover:bg-black/40 transition">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Upload a {fileType || "file"}</span>
                <input 
                    type="file"
                    accept={fileType === "video" ? "video/*" : "image/*"}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Max size: 100MB</span>
            </label>
            {uploading && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 animate-pulse w-full" style={{ width: '100%' }} />
                </div>
            )}
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
};




export default FileUpload;

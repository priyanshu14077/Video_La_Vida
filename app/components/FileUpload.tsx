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
        <>
            
            <input 
            type="file"
            accept = { fileType === "video" ? "video/*" : "image/*" }
            onChange={handleFileChange}  />

            {uploading && (
                <span>Loading...</span>

            )}
            
        </>
    );
};




export default FileUpload;

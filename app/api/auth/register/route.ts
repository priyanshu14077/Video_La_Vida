import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { NextRequest , NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
       const {email , password} = await request.json()
       
       if(!email || !password) {
           return NextResponse.json({message: "Email and password are required"}, {status: 400})
       }

       await connectToDatabase();

       const exisitingUser = await User.findOne({ email });
       if (exisitingUser) {
        return NextResponse.json({message: "User already exists"}, {status: 400});
       }  


       await User.create({
           email,
           password,
       });

       return NextResponse.json({message: "User Registration Success"}, {status: 400})



    

    } catch(error) {
        console.error("Error registering user:", error);

        return NextResponse.json({error: "Failed to register "}, {status: 400});

    }
}
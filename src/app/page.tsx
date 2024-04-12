'use client'
import TypewriterComponent from "typewriter-effect";
import { KeyRound, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/_context/AuthContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  const { googleSignIn } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      redirect('/home')
    }
  }, [])

  return (
    <main className="flex h-full m-0">
      <Image
        src='/bg.jpg'
        alt="background"
        height={500}
        width={500}
        className="h-[100vh] filter brightness-50"
      >
      </Image>
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-center items-center">
          <h1 className="text-5xl text-white font-bold texteffect">
            <TypewriterComponent options={{
              strings: ['HomeManager'],
              autoStart: true,
              loop: true,
              deleteSpeed: 0,
              cursor: ""
            }} />
          </h1>
        </div>
      </div>
      <div className="w-full space-y-4 absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-y-2 w-full px-4">
          <button
            onClick={googleSignIn}
            className="bg-white flex justify-center gap-x-2 items-center p-3 rounded-3xl text-black w-full">
            <Image src='/googlelogo.png' alt="google" className="h-8 w-8" width={100} height={100}></Image>
            <p className="text-lg">Sign in with Google</p>
          </button>
          <button
            onClick={googleSignIn}
            className="bg-white flex justify-center gap-x-2 items-center p-3 rounded-3xl text-black w-full">
            <Image src='/googlelogo.png' alt="google" className="h-8 w-8" width={100} height={100}></Image>
            <p className="text-lg">Sign up with Google</p>
          </button>
        </div>
        <div className="flex justify-center items-center">
          <div className="text-white text-center h-10 w-10 rounded-full bg-transparent border border-white text-xl">
            <p className="mt-1">Or</p>
          </div>
        </div>
        <form>
          <div className="w-full flex flex-col px-4 gap-y-2">
            <div className="w-full flex relative">
              <input type="text" placeholder="Enter your email" className="placeholder:text-white bg-transparent border border-white p-4 w-full text-white rounded-3xl" />
              <Mail className="absolute right-4 top-4" color="white" />
            </div>
            <div className="w-full flex relative">
              <input type="password" placeholder="Enter your password" className="placeholder:text-white bg-transparent border border-white p-4 w-full text-white rounded-3xl" />
              <KeyRound className="absolute right-4 top-4" color="white" />
            </div>
            <div className="w-full">
              <p className="text-right text-white">
                <Link href='/'>Forgot Password ?</Link>
              </p>
            </div>
            <button className="bg-indigo-600 rounded-3xl text-white p-4">Login</button>
          </div>
        </form>
        <div className="px-4"> <hr className="hr" /></div>
        <div className="px-4">
          <button className="bg-violet-800 flex justify-center gap-x-2 items-center p-3 rounded-3xl text-white w-full">
            Skip the Signin / Signup
          </button>
        </div>
      </div>
    </main>
  );
}

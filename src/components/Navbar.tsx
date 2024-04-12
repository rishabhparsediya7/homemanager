'use client'
import { useAuth } from "@/app/_context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserProps = {
    name: string,
    photoUrl: string,
}

export default function Navbar() {
    const { googleSignIn, logOut } = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<UserProps>({ name: "", photoUrl: "" });
    const [toggle, setToggle] = useState<boolean>(false);
    useEffect(() => {
        const { token, user, isLoggedIn } = localStorage;
        let storageUser;
        if (user !== undefined)
            storageUser = JSON.parse(user);
        else {
            return;
        }
        if (token === 'undefined' || token === undefined)
            return;
        const logd = !!isLoggedIn
        setLoggedIn(logd);
        setUser({
            ...user,
            name: storageUser.displayName,
            photoUrl: storageUser.photoURL
        })
    }, [loggedIn])
    return (
        <nav className="bg-white">
            <div className={`flex ${toggle ? `border-b-2` : `shadow-md`} w-full mx-auto px-2 sm:px-8 h-20 relative justify-between items-center`}>
                <div className="inline-flex">
                    <a className="_o6689fn" href="/">
                        <div className="flex">
                            <Image
                                src="/navlogo.png"
                                alt="logo"
                                width={100}
                                height={100}
                            >
                            </Image>
                        </div>
                    </a>
                </div>
                <div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
                    <div className="inline-block">
                        <div className="inline-flex items-center max-w-full">
                            {/* {starting point} */}
                            <div className="dropdown inline-block relative">
                                <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                                    <span className="mr-1">Dropdown</span>
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
                                </button>
                                <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                                    <li className=""><a className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">One</a></li>
                                    <li className=""><a className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">Two</a></li>
                                    <li className=""><a className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">Three is the magic number</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="flex-initial">
                    <div className="flex justify-end items-center relative">
                        {!loggedIn && <div className="hidden sm:flex mr-4 gap-x-2 items-center">
                            <button
                                onClick={googleSignIn}
                                className="bg-indigo-600 rounded-md text-white w-fit px-3 py-1">
                                Login</button>
                            <button
                                onClick={googleSignIn}
                                className="bg-indigo-600 rounded-md text-white w-fit px-3 py-1">
                                Signup
                            </button>
                        </div>}
                        <div className="block">
                            <div className="inline relative">
                                <button type="button" className="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg">
                                    <div className="pl-1 sm:pl-0 block sm:hidden" onClick={() => setToggle(!toggle)}>
                                        <svg
                                            viewBox="0 0 32 32"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="presentation"
                                            focusable="false"
                                            style={{ display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: "3", overflow: "visible" }}
                                        >
                                            <g fill="none" fillRule="nonzero">
                                                <path d="m2 16h28"></path>
                                                <path d="m2 24h28"></path>
                                                <path d="m2 8h28"></path>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="block flex-grow-0 flex-shrink-0 h-10 sm:h-8 sm:w-fit pl-5 sm:pl-2">
                                        {loggedIn === false ? <svg
                                            viewBox="0 0 32 32"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="presentation"
                                            focusable="false"
                                            style={{ display: "block", height: "100%", width: "100%", fill: "#3949AB" }}
                                        >
                                            <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                                        </svg> :
                                            <div className="flex w-full h-full items-center gap-x-2">
                                                <p className="text-sm my-auto">Hello, {user.name}</p>
                                                <Image
                                                    src={user.photoUrl}
                                                    alt={user.name}
                                                    width={100}
                                                    height={100}
                                                    className="mt-1 rounded-full h-[24px] w-[24px]"
                                                >
                                                </Image>
                                            </div>}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {toggle && <div className="w-full block sm:hidden h-20 shadow-md transform transition-all items-center bg-white px-5">
                {loggedIn ?
                    <div className="h-full flex justify-start gap-x-2 items-center">
                        <Link className="bg-indigo-600 rounded-md text-white h-fit w-fit px-3 py-1" href="/home">Home</Link>
                        <Link className="bg-indigo-600 rounded-md text-white h-fit w-fit px-3 py-1" href="/expense">Expense</Link>
                        <button
                            onClick={logOut}
                            className="bg-indigo-600 rounded-md h-fit text-white w-fit px-3 py-1">
                            Logout
                        </button>
                    </div>
                    :
                    <ul className="flex justify-between h-full">
                        <li className="m-auto">
                            <button
                                onClick={googleSignIn}
                                className="bg-indigo-600 rounded-md text-white w-fit px-3 py-1">
                                Login
                            </button>
                        </li>
                        <li className="m-auto">
                            <button
                                onClick={googleSignIn}
                                className="bg-indigo-600 rounded-md text-white w-fit px-3 py-1">
                                Signup
                            </button>
                        </li>
                    </ul>
                }
            </div>
            }
        </nav >
    )
}
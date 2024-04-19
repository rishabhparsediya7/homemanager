"use client";
import React from "react";
import ReactPlayer from "react-player";

export default function Video() {
    let videosrc = "/landingvideo.mp4";
    return (
        <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
        >
            <source src={videosrc} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};
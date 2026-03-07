"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const AvatarSection = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative mx-auto aspect-square w-[min(86vw,400px)] md:w-[min(44vw,480px)] flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: hovered ? 6 : 12,
                    ease: "linear",
                }}
                className={`absolute inset-0 rounded-full border-[3px] border-dashed border-purple-400 transition-all duration-500 ${
                    hovered
                        ? "shadow-[0_0_60px_rgba(168,85,247,0.55)]"
                        : "shadow-[0_0_35px_rgba(168,85,247,0.3)]"
                }`}
            />

            {/* Avatar */}
            <motion.div
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative aspect-square w-[85%] rounded-full overflow-hidden"
            >
                <img
                    src="/images/avatar_hero.png"
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>

            {/* Glow */}
            <motion.div
                animate={{
                    opacity: hovered ? [0.25, 0.6, 0.25] : 0.25,
                    scale: hovered ? [1, 1.08, 1] : 1,
                }}
                transition={{
                    duration: 2,
                    repeat: hovered ? Infinity : 0,
                    ease: "easeInOut",
                }}
                className="pointer-events-none absolute -z-10 aspect-square w-[115%] rounded-full bg-purple-400/10 blur-3xl"
            />
        </div>
    );
};

export default AvatarSection;

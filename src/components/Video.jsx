import React, { useEffect, useState } from "react";
import TitleHeader from "@/components/TitleHeader.jsx";
import MuxPlayer from "@mux/mux-player-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ExternalLink, FolderOpen } from "lucide-react";
import { SiTiktok, SiGoogledrive } from "react-icons/si";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5002").replace(/\/$/, "");

export default function VideoList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        fetch(`${API_BASE_URL}/api/videos`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Fetch error:", err);
                    setError("Không tải được danh sách video.");
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    return (
        <section
            id="videos"
            className="flex-center md:mt-40 mt-20 section-padding xl:px-0"
        >
            <div className="w-full h-full md:px-20 px-5">
                <TitleHeader title="Product Videos" sub="🎬 Featured Demos" />

                <div className="mt-20 relative">
                    {loading && <p className="text-gray-400">Loading videos...</p>}
                    {error && <p className="text-red-400">{error}</p>}

                    {!loading &&
                        !error &&
                        categories.map((cat) => (
                            <div key={cat.category} className="mb-16">
                                <h3 className="text-2xl font-semibold mb-4 capitalize">
                                    {cat.category}
                                </h3>

                                {!cat.videos?.length ? (
                                    <p className="text-gray-500">No videos available.</p>
                                ) : (
                                    <Carousel
                                        opts={{ align: "start", loop: false }}
                                        className="w-full"
                                    >
                                        <CarouselContent>
                                            {cat.videos.map((video) => (
                                                <CarouselItem
                                                    key={video.id}
                                                    className="basis-full sm:basis-1/2 lg:basis-1/3"
                                                >
                                                    <div className="relative w-full aspect-[9/16] overflow-hidden rounded-xl bg-black">
                                                        <MuxPlayer
                                                            playbackId={video.playbackId}
                                                            streamType="on-demand"
                                                            controls
                                                            preload="metadata"
                                                            metadataVideoTitle={video.title || "Video"}
                                                            className="absolute inset-0 w-full h-full"
                                                        />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>

                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                )}
                            </div>
                        ))}
                    {!loading && !error && (
                        <div className="mt-12 flex justify-center">
                            <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 px-5 py-4 shadow-[0_0_40px_rgba(255,255,255,0.06)] backdrop-blur">
                                <p className="text-center text-sm md:text-base text-white/85">
                                    Khám phá thêm video trên{" "}
                                    <span className="font-semibold text-white">TikTok</span> hoặc{" "}
                                    <span className="font-semibold text-white">Google Drive</span>
                                </p>

                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <a
                                        href="https://www.tiktok.com/@your-account"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Xem thêm video trên TikTok"
                                        title="TikTok"
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                                    >
                                        <SiTiktok className="h-5 w-5 text-white" />
                                    </a>

                                    <a
                                        href="https://drive.google.com/drive/folders/1TRTkHc1nkUpBg4yvDDeRDXjPUy65K65T"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Xem thêm video trên Google Drive"
                                        title="Google Drive"
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                                    >
                                        <SiGoogledrive className="h-5 w-5 text-white" />
                                    </a>
                                </div>


                            </div>
                        </div>
                    )}



                </div>
            </div>

        </section>
    );
}

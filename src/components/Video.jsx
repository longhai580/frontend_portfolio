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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiTiktok, SiGoogledrive } from "react-icons/si";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CategoryCarousel({ videos }) {
    const [api, setApi] = useState(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
        if (!api) return;

        const updateScrollState = () => {
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        };

        updateScrollState();
        api.on("select", updateScrollState);
        api.on("reInit", updateScrollState);

        return () => {
            api.off("select", updateScrollState);
            api.off("reInit", updateScrollState);
        };
    }, [api]);

    return (
        <Carousel opts={{ align: "start", loop: false }} setApi={setApi} className="w-full">
            <CarouselContent>
                {videos.map((video) => (
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

            <CarouselPrevious className="left-2 md:-left-12 z-20 border-white/30 bg-black/55 text-white hover:bg-black/80" />
            <CarouselNext className="right-2 md:-right-12 z-20 border-white/30 bg-black/55 text-white hover:bg-black/80" />

            {canScrollPrev && (
                <div className="pointer-events-none absolute left-2 md:left-4 top-1/2 z-10 -translate-y-1/2">
                    <div className="video-swipe-hint video-swipe-hint-left">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden md:inline">Vuot</span>
                    </div>
                </div>
            )}

            {canScrollNext && (
                <div className="pointer-events-none absolute right-2 md:right-4 top-1/2 z-10 -translate-y-1/2">
                    <div className="video-swipe-hint video-swipe-hint-right">
                        <span className="hidden md:inline">Xem them</span>
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
            )}
        </Carousel>
    );
}

export default function VideoList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

    useEffect(() => {
        const controller = new AbortController();

        fetch(`${apiBaseUrl}/api/videos`, { signal: controller.signal })
            .then(async (res) => {
                const contentType = res.headers.get("content-type") || "";
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                if (!contentType.includes("application/json")) {
                    const snippet = (await res.text()).slice(0, 120);
                    throw new Error(`Expected JSON but got: ${snippet}`);
                }
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
    }, [apiBaseUrl]);

    return (
        <section
            id="videos"
            className="flex-center md:mt-40 mt-20 section-padding xl:px-0"
        >
            <div className="w-full h-full md:px-20 px-5">
                <TitleHeader title="Product Videos" sub="🎬 Featured Demos" />

                <div className="mt-20 relative">
                    {loading && (
                        <div className="space-y-14">
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className="space-y-5">
                                    <Skeleton height={34} width={220} borderRadius={10} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {[...Array(3)].map((__, cardIdx) => (
                                            <div
                                                key={cardIdx}
                                                className="rounded-xl border border-white/10 bg-white/[0.03] p-2"
                                            >
                                                <Skeleton
                                                    className="w-full"
                                                    containerClassName="block"
                                                    height={320}
                                                    borderRadius={12}
                                                />
                                                <div className="mt-3 space-y-2">
                                                    <Skeleton height={14} width="78%" borderRadius={8} />
                                                    <Skeleton height={12} width="42%" borderRadius={8} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                                    <CategoryCarousel videos={cat.videos} />
                                )}
                            </div>
                        ))}
                    {!loading && !error && (
                        <div className="mt-12 flex justify-center">
                            <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 px-5 py-4 shadow-[0_0_40px_rgba(255,255,255,0.06)] backdrop-blur">
                                <p className="text-center text-sm md:text-base text-white/85">
                                    See more on{" "}
                                    <span className="font-semibold text-white">TikTok</span> or{" "}
                                    <span className="font-semibold text-white">Google Drive</span>
                                </p>

                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <a
                                        href="https://www.tiktok.com/@ryan.quayphim?is_from_webapp=1&sender_device=pc"
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

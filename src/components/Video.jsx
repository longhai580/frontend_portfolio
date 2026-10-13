import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import TitleHeader from "@/components/TitleHeader.jsx";
import { useInView } from "react-intersection-observer";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { SiTiktok, SiGoogledrive } from "react-icons/si";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ---------------------------------------------------------------------------
// Video list: requested as soon as this module loads (in parallel with the 3D
// hero), and remembered in localStorage so repeat visits render instantly.
// ---------------------------------------------------------------------------
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const CACHE_KEY = "portfolio:videos:v1";

function readCachedVideos() {
    try {
        const data = JSON.parse(localStorage.getItem(CACHE_KEY));
        return Array.isArray(data) ? data : null;
    } catch {
        return null;
    }
}

function writeCachedVideos(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        // Storage can be full or blocked (private mode); the list still renders.
    }
}

let videosRequest = null;

function requestVideos() {
    if (!videosRequest) {
        videosRequest = fetch(`${API_BASE_URL}/api/videos`)
            .then(async (res) => {
                const contentType = res.headers.get("content-type") || "";
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                if (!contentType.includes("application/json")) {
                    const snippet = (await res.text()).slice(0, 120);
                    throw new Error(`Expected JSON but got: ${snippet}`);
                }
                const data = await res.json();
                const categories = Array.isArray(data) ? data : [];
                writeCachedVideos(categories);
                return categories;
            })
            .catch((err) => {
                videosRequest = null; // allow a retry on the next mount
                throw err;
            });
    }
    return videosRequest;
}

if (typeof window !== "undefined") requestVideos();

// ---------------------------------------------------------------------------
// Player: the heavy Mux player bundle is only downloaded when a visitor is
// about to play something; until then each card is just a lightweight image.
// ---------------------------------------------------------------------------
const loadMuxPlayer = () => import("@mux/mux-player-react");
const MuxPlayer = lazy(loadMuxPlayer);
const prefetchPlayer = () => {
    loadMuxPlayer().catch(() => {});
};

const thumbnail = (playbackId, width) =>
    `https://image.mux.com/${playbackId}/thumbnail.webp?width=${width}`;

const VideoCard = memo(function VideoCard({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const title = video.title || "Video";
    const poster = thumbnail(video.playbackId, 480);
    const posterImage = (
        <img
            src={poster}
            srcSet={[320, 480, 720]
                .map((w) => `${thumbnail(video.playbackId, w)} ${w}w`)
                .join(", ")}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
    );

    return (
        <div className="group relative w-full aspect-[9/16] overflow-hidden rounded-xl bg-black">
            {isPlaying ? (
                <Suspense fallback={posterImage}>
                    <MuxPlayer
                        playbackId={video.playbackId}
                        streamType="on-demand"
                        autoPlay
                        controls
                        poster={poster}
                        placeholder={poster}
                        metadata={{ video_id: video.id, video_title: title }}
                        style={{ aspectRatio: "9 / 16" }}
                        className="absolute inset-0 w-full h-full"
                    />
                </Suspense>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    // Start fetching the player code on intent, before the click lands.
                    onPointerEnter={prefetchPlayer}
                    onTouchStart={prefetchPlayer}
                    onFocus={prefetchPlayer}
                    aria-label={`Phát video: ${title}`}
                    className="absolute inset-0 h-full w-full cursor-pointer"
                >
                    {posterImage}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/55 backdrop-blur transition-transform duration-200 group-hover:scale-110">
                            <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
                        </span>
                    </span>
                </button>
            )}
        </div>
    );
});

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
                        <VideoCard video={video} />
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
    // Show the last known list immediately; the network response replaces it.
    const [cached] = useState(readCachedVideos);
    const [categories, setCategories] = useState(cached || []);
    const [loading, setLoading] = useState(!cached);
    const [error, setError] = useState("");

    // When the section gets close, quietly fetch the player code so the first
    // click starts playback without waiting for the download.
    const { ref: sectionRef, inView: nearSection } = useInView({
        rootMargin: "600px 0px",
        triggerOnce: true,
    });

    useEffect(() => {
        if (!nearSection) return;
        const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
        idle(prefetchPlayer);
    }, [nearSection]);

    useEffect(() => {
        let active = true;

        requestVideos()
            .then((data) => {
                if (!active) return;
                setCategories(data);
                setError("");
            })
            .catch((err) => {
                if (!active) return;
                console.error("Fetch error:", err);
                // Keep showing the cached list if we have one.
                if (!cached) setError("Không tải được danh sách video.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [cached]);

    return (
        <section
            ref={sectionRef}
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

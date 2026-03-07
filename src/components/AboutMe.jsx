import React from "react";
import TitleHeader from "@/components/TitleHeader.jsx";
import { useTranslation, Trans } from "react-i18next";
import Button from "@/components/Button.jsx";

const AboutMe = () => {
    const { t } = useTranslation();

    const tools = t("about.tools", { returnObjects: true });
    const timeline = t("about.timeline", { returnObjects: true });

    return (
        <section id="about" className="section-padding">
            <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
                <TitleHeader
                    title={t("about.heading")}
                    sub={t("about.title")}
                />

                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
                    <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 md:p-9">
                        <div className="max-w-[62ch]">
                            <p className="text-[17px] md:text-[18px] leading-8 text-zinc-300">
                                <Trans i18nKey="about.paragraph1" />
                            </p>

                            <p className="mt-6 text-[17px] md:text-[18px] leading-8 text-zinc-300">
                                <Trans i18nKey="about.paragraph2" />
                            </p>

                            <p className="mt-6 text-[17px] md:text-[18px] leading-8 text-zinc-300">
                                {t("about.paragraph3")}
                            </p>
                            <p className="mt-6 text-[17px] md:text-[18px] leading-8 text-zinc-300">
                                {t("about.paragraph4")}
                            </p>

                        </div>

                        <div className="mt-7 flex flex-wrap gap-2.5">
                            {tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-sm font-medium tracking-[0.01em] text-white/90"
                                >
                  {tool}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 rounded-3xl border border-purple-400/20 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)] p-7 md:p-8 flex flex-col">
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.14em] text-purple-200/85">
                            {t("about.creativeJourney")}
                        </p>

                        <div className="mt-6 space-y-6 flex-1">
                            {timeline.map((item) => (
                                <div key={item.year} className="flex gap-4">
                                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-300" />
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold tracking-wide text-purple-100/75">
                                            {item.year}
                                        </p>
                                        <p className="mt-1.5 text-[15px] md:text-[17px] leading-7 text-zinc-100 max-w-[28ch]">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-2">
                            <Button
                                text={t("video.button")}
                                className="w-full h-12 md:h-14 text-sm md:text-base font-semibold tracking-wide"
                                id="videos"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;

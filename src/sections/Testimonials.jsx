import React from 'react'
import TitleHeader from "../components/TitleHeader.jsx";
import {testimonials} from "../constants/index.js";
import GlowCard from "../components/GlowCard.jsx";
import {useTranslation} from "react-i18next";

const Testimonials = () => {
    const { t } = useTranslation();
    const reviews = t("feedback.testimonials", { returnObjects: true });
    return (
        <section id="testimonials" className="flex-center section-padding">
            <div className="w-full h-full md:px-1 px-5">
                {/*<TitleHeader*/}
                {/*    title="What People Say About Me?"*/}
                {/*    sub="⭐️ Client Feedback Highlights"*/}
                {/*/>*/}
                <TitleHeader title={t("feedback.subtitle")} sub={t("feedback.title")} />

                <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
                    {reviews.map(({imgPath, name, mentions, review}) => (
                        <GlowCard card={{review}} >
                            <div className="flex items-center gap-3">
                                <div>
                                    <img src={imgPath} alt={name}/>
                                </div>
                                <div>
                                    <p className="font-bold">
                                        {name}
                                    </p>
                                    <p className="text-white-50">{mentions}</p>
                                </div>
                            </div>
                        </GlowCard>
                    ))}

                </div>

            </div>

        </section>
    )
}
export default Testimonials

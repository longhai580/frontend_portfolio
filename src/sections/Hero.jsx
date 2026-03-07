import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants";
import AvatarSection from "@/sections/AvatarSection.jsx";
import {useTranslation} from "react-i18next";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });
    const { t } = useTranslation();

  return (
      <section id="hero" className="relative overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
              <img src="/images/bg.png" alt="" className="h-full w-full object-cover" />
          </div>

          <div className="hero-layout">
              {/* AVATAR - mobile first */}
              <figure className="hero-3d-layout order-1 lg:order-2 w-full overflow-hidden">
                  <div className="avatar-mobile-fix mx-auto w-full max-w-[280px] sm:max-w-[330px] md:max-w-[400px] lg:max-w-[450px]">
                      <AvatarSection />
                  </div>
              </figure>

              {/* TEXT - mobile second */}
              <header className="order-2 lg:order-1 flex flex-col justify-center w-full md:px-20 px-5">
                  <div className="flex flex-col gap-7">
                      <div className="hero-text">
                          <h1 className="hero-line hero-line-main">
                              {t("hero.title1")}
                              <span className="slide">
    <span className="wrapper">
      {words.map((word, index) => (
          <span key={index} className="word-item">
          <img src={word.imgPath} alt="person" className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50" />
          <span>{word.text}</span>
        </span>
      ))}
    </span>
  </span>
                          </h1>

                          <h1 className="hero-line">{t("hero.title2")}</h1>
                          <h1 className="hero-line lg:whitespace-nowrap">{t("hero.title3")}</h1>

                      </div>

                      <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
                          {t("hero.description")}
                      </p>

                      <Button text={t("hero.button")} className="w-full sm:w-60 md:w-80 md:h-16 h-12" id="counter" />
                  </div>
              </header>
          </div>

          <AnimatedCounter />
      </section>
  );
};

export default Hero;

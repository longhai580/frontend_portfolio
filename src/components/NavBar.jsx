import { useState, useEffect } from "react";
import { navLinks } from "../constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import "../../i18n.js";
import LanguageSwitcher from "@/components/LanguageSwitcher.jsx"; // import cấu hình i18n

const ADMIN_EMAIL = "nguyenhai3266@gmail.com";

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [email, setEmail] = useState("");
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleEmailSubmit = () => {
        if (email === ADMIN_EMAIL) {
            setShowEmailModal(false);
            setShowUploadModal(true);
        } else {
            alert("Email không đúng!");
        }
    };

    const toggleLang = () => {
        const newLang = i18n.language === "en" ? "vi" : "en";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang);
    };

    return (
        <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
            <div className="inner">
                <div className="flex items-center gap-2">

                    <a href="#hero" className="logo">{t("name")}</a>
                </div>

                <nav className="desktop">
                    <ul>
                        {navLinks.map(({ link, name }) => (
                            <li key={name} className="group">
                                <a href={link}>
                                    <span>{t(`navbar.${name}`)}</span>
                                    <span className="underline" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                   <LanguageSwitcher />


                    <a href="#contact" className="contact-btn group">
                        <div className="inner">
                            <span>{t("contact")}</span>
                        </div>
                    </a>
                </div>
            </div>

        </header>
    );
};

export default NavBar;

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import TitleHeader from "../components/TitleHeader";
import { ContactExperience } from "../components/models/contact/ContactExperience.jsx";
import { FaPhoneAlt, FaFacebook, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import {useTranslation} from "react-i18next";

const Contact = () => {
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const { t} = useTranslation();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await emailjs.sendForm(
                import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
            );

            setForm({ name: "", email: "", message: "" });
            alert("✅ Message sent successfully!");
        } catch (error) {
            console.error("EmailJS Error:", error);
            alert("❌ Failed to send message. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="flex-center section-padding">
            <div className="w-full h-full md:px-10 px-5">
                <TitleHeader
                    title={t("contact_form.title")}
                    sub={t("contact_form.subtitle")}
                />

                <div className="grid-12-cols mt-16">
                    {/* LEFT: FORM */}
                    <div className="xl:col-span-5">
                        <div className="flex-center card-border rounded-xl p-10 bg-[#1a1a1a]">
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="w-full flex flex-col gap-7"
                            >
                                <div>
                                    <label htmlFor="name" className="block text-gray-300 mb-2">
                                        {t("contact_form.labels.name")}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder={t("contact_form.placeholders.name")}
                                        required
                                        className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white focus:border-blue-400 outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-gray-300 mb-2">
                                        {t("contact_form.labels.email")}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder={t("contact_form.placeholders.email")}
                                        required
                                        className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white focus:border-blue-400 outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-gray-300 mb-2">
                                        {t("contact_form.labels.message")}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder={t("contact_form.placeholders.message")}
                                        rows="5"
                                        required
                                        className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white focus:border-blue-400 outline-none resize-none"
                                    />
                                </div>

                                <button type="submit" disabled={loading}>
                                    <div className="cta-button group">
                                        <div className="bg-circle" />
                                        <p className="text">{loading ? `${t("contact_form.button.sending")}` : `${t("contact_form.button.send")}`}</p>
                                        <div className="arrow-wrapper">
                                            <img src="/images/arrow-down.svg" alt="arrow" />
                                        </div>
                                    </div>
                                </button>
                            </form>

                            {/* SOCIAL CONTACT */}

                        </div>
                    </div>

                    {/* RIGHT: 3D Contact Model */}
                    <div className="xl:col-span-7 min-h-96">
                        <div className="w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
                            <ContactExperience />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

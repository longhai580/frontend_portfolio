import i18n from "../../i18n"; // hoặc đường dẫn đúng tới file i18n của bạn

const LanguageSwitcher = () => {
    const toggleLang = () => {
        const newLang = i18n.language === "en" ? "vi" : "en";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang); // lưu lại để reload vẫn nhớ
    };

    return (
        <button
            onClick={toggleLang}
            className="lang-btn flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer transition"
        >
            {i18n.language === "en" ? (
                <>
                    <img src="/images/usFlag.png" alt="English" className="w-7 h-5" />
                </>
            ) : (
                <>
                    <img src="/images/vietnam.png" alt="Vietnamese" className="w-7 h-5" />
                </>
            )}
        </button>
    );
};

export default LanguageSwitcher;

    /**
     * A reusable CTA button component.
     * When clicked, it scrolls smoothly to the section with ID "counter",
     * with a small offset from the top for better visual placement.
     */

    const Button = ({ text, className, id }) => {
        return (
            <a
                href={id ? `#${id}` : "#"}
                onClick={(e) => {
                    e.preventDefault();

                    if (!id) return;
                    const target = document.getElementById(id); // dùng id truyền vào
                    if (!target) return;

                    const offset = window.innerHeight * 0.12;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                }}
                className={`${className ?? ""} cta-wrapper`}
            >
                <div className="cta-button group">
                    <div className="bg-circle" />
                    <p className="text">{text}</p>
                    <div className="arrow-wrapper">
                        <img src="/images/arrow-down.svg" alt="arrow" />
                    </div>
                </div>
            </a>
        );
    };


    export default Button;

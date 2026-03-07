import { socialImgs } from "../constants";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
          <div className="flex justify-center">
              <a
                  href="tel:+84901234567"
                  className="flex items-center gap-3 p-3 rounded-full  transition"
                  aria-label="Phone"
              >
                  <FaPhoneAlt className="text-white text-lg" />
                  <p className="text-white text-sm font-medium"> 0975 698 027</p>
              </a>
              <a
                  href="tel:+84901234567"
                  className="flex items-center gap-3 p-3 rounded-full  transition"
                  aria-label="Phone"
              >
                  <FaEnvelope className="text-white text-lg" />
                  <p className="text-white text-sm font-medium">nguyenhai3266@gmail.com</p>
              </a>
          </div>

        <div className="socials">
          {socialImgs.map((socialImg, index) => (
            <div key={index} className="icon">
                <a
                    href={socialImg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
              <img src={socialImg.imgPath} alt="social icon" />
                </a>

            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Hai Nguyen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

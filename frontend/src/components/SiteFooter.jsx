import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import wing from "../assets/wing.png";
import sisa_cert from "../assets/sisa_cert.png";
import awardg from "../assets/award.png";

export default function SiteFooter() {
  return (
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[30px] sm:gap-[50px]">
            {[
              ["Popular Products", ["Car Loan", "Moto Loan", "Secured Home Loan", "Internet Banking", "Most JiJiJi"]],
              ["Partner With Us", ["Become a Wing Merchant", "Wing Merchant App", "Bakong ATM", "Become a Wing Agent", "Wing POS Terminal"]],
              ["Get Support", ["Exchange Rates", "Wing Help", "Feedback Form", "Contact Center", "Wing Bank Branches"]],
              ["About Wing Bank", ["News", "About Us", "Careers", "Promotions"]],
            ].map(([heading, items]) => (
              <div key={heading}>
                <h4 className="text-base font-bold mb-5">{heading}</h4>
                <ul className="space-y-[14px] text-[15px] text-gray-500">
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[25px] mt-12 sm:mt-14 pt-9 border-t">
            <div className="flex items-center gap-[18px] flex-wrap">
              <img src={wing} alt="Wing Bank" className="w-[140px]" />
              <img src={sisa_cert} alt="SISA Certificate" className="w-[70px]" />
              <img src={awardg} alt="Award" className="w-[50px]" />
            </div>

            <div className="flex items-center gap-3">
              {[FaInstagram, FaYoutube, FaTiktok, FaXTwitter].map((Icon, i) => (
                <div
                  key={i}
                  className="w-[38px] h-[38px] rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-[15px] mt-7 text-[13px] text-gray-400">
            <p>© 2026 Wing Bank (Cambodia) Plc. All rights reserved.</p>
            <div className="flex flex-wrap gap-[22px]">
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
              <span>End User Terms and Conditions</span>
            </div>
          </div>
        </div>
      </footer>
  );
}

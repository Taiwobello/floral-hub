import { FunctionComponent } from "react";
import Link from "next/link";
import styles from "./Layout.module.scss";
import useDeviceType from "../../utils/hooks/useDeviceType";
import { footerContent, paypalEmail } from "../../utils/constants";

const Footer: FunctionComponent = () => {
  const deviceType = useDeviceType();

  return (
    <footer className={styles.footer} id="footer">
      <Link href="/">
        <a className={styles["footer-logo"]}>
          <img
            src="/images/footer-logo.svg"
            alt="logo"
            className={styles["logo-image"]}
          />
        </a>
      </Link>

      <div className={styles["footer-wrapper"]}>
        <div className={styles.top}>
          <div>
            <strong className="text-regular">Get more from Floralhub</strong>

            <button
              className={[styles["news-btn"], "flex spaced center-align"].join(
                " "
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="generic-icon medium"
              >
                <path
                  d="M2.243 6.85399L11.49 1.30999C11.6454 1.21674 11.8233 1.16748 12.0045 1.16748C12.1857 1.16748 12.3636 1.21674 12.519 1.30999L21.757 6.85499C21.8311 6.8994 21.8925 6.96227 21.9351 7.03746C21.9776 7.11264 22 7.19758 22 7.28399V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V7.28299C1.99998 7.19658 2.02236 7.11164 2.06495 7.03646C2.10753 6.96127 2.16888 6.8984 2.243 6.85399ZM4 8.13299V19H20V8.13199L12.004 3.33199L4 8.13199V8.13299ZM12.06 13.698L17.356 9.23499L18.644 10.765L12.074 16.302L5.364 10.772L6.636 9.22799L12.06 13.698Z"
                  fill="#09121F"
                />
              </svg>

              <strong>Sign up for latest news</strong>
            </button>
          </div>

          <div className="flex spaced column">
            <strong className="text-medium">About</strong>
            {footerContent.about.map(link => (
              <Link key={link.title} href={link.url}>
                <a className="">{link.title}</a>
              </Link>
            ))}
          </div>
          <div className="flex spaced column">
            <strong className="text-medium">Shop by Occasion</strong>
            {footerContent.occassions.map(link => (
              <Link key={link.title} href={link.url}>
                <a className="">{link.title}</a>
              </Link>
            ))}
          </div>

          <div className="flex spaced column">
            <strong className="text-medium">Seasonal Gifts</strong>
            {footerContent.gifts.map(link => (
              <Link key={link.title} href={link.url}>
                <a className="">{link.title}</a>
              </Link>
            ))}
          </div>

          <div className="flex spaced column">
            <strong className="text-regular">Legal</strong>
            {footerContent.legals.map(link => (
              <Link key={link.title} href={link.url}>
                <a className="">{link.title}</a>
              </Link>
            ))}
          </div>
        </div>
        {deviceType === "desktop" && (
          <strong className="text-regular">Payment Information</strong>
        )}
        <div className={`${styles.bottom}`}>
          <div className="flex spaced column">
            {deviceType === "mobile" && (
              <strong className="text-regular">Payment Information</strong>
            )}
            <strong>Bank Transfers (Naira)</strong>
            <div className="flex spaced">
              <span className={styles.grayed}>Bank:</span>{" "}
              <strong>{footerContent.bankName}</strong>
            </div>
            <div className="flex spaced">
              <span className={styles.grayed}>Account Number: </span>{" "}
              <strong>{footerContent.accountNo}</strong>
            </div>
            <div className="flex spaced">
              <span className={styles.grayed}>Account Name: </span>{" "}
              <strong>{footerContent.accountName}</strong>
            </div>
            <strong>Paypal</strong>
            <div
              className={`flex spaced ${
                deviceType === "mobile" ? "column" : ""
              }`}
            >
              <span className={styles.grayed}>Email:</span>{" "}
              <strong>{paypalEmail}</strong>
            </div>
            <strong>Bitcoin</strong>
            <div className="">
              <span className={styles.grayed}>Address: </span>{" "}
              <strong>{footerContent.bitcoinAddress}</strong>
            </div>
          </div>

          <div className="flex spaced column ">
            <strong>{footerContent.lagosBranch.name}</strong>
            <div className="flex spaced">
              <img
                src="/icons/map-pin.svg"
                alt="map pin"
                className="generic-icon medium"
              />
              <Link href={footerContent.lagosBranch.url}>
                <a target="_blank">{footerContent.lagosBranch.location}</a>
              </Link>
            </div>

            <p className={styles.grayed}>
              {footerContent.abujaBranch.workingTimes}
            </p>
          </div>
          <div className="flex spaced column ">
            <strong>{footerContent.abujaBranch.name}</strong>
            <div className="flex spaced">
              <img
                src="/icons/map-pin.svg"
                alt="map pin"
                className="generic-icon medium"
              />
              <Link href={footerContent.abujaBranch.url}>
                <a target="_blank">{footerContent.abujaBranch.location}</a>
              </Link>
            </div>

            <p className={styles.grayed}>
              {footerContent.abujaBranch.workingTimes}
            </p>
          </div>
          <div className="flex spaced column">
            <strong className="text-medium">Get In Touch</strong>

            <div className="flex spaced column">
              {footerContent.contacts.map((contact, index) => (
                <div
                  className={`flex spaced center-align ${
                    index === footerContent.contacts.length - 1
                      ? "underline"
                      : ""
                  }`}
                  key={index}
                >
                  <img
                    src={contact.icon}
                    alt="icon"
                    className="generic-icon small"
                  />
                  <Link href={contact.url}>
                    <a target="_blank" className="">
                      {contact.title}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

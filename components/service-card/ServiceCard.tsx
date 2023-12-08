import { FunctionComponent } from "react";
import styles from "./ServiceCard.module.scss";
import Link from "next/link";
import useDeviceType from "../../utils/hooks/useDeviceType";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  image: string;
  className?: string;
  buttonText?: string;
  url?: string;
}

const ServiceCard: FunctionComponent<ServiceCardProps> = props => {
  const { title, subtitle, image, className, buttonText, url } = props;
  const deviceType = useDeviceType();
  return (
    <Link href={url || "#"}>
      <a className={[styles["service-card"], className].join(" ")}>
        {deviceType === "mobile" && (
          <img alt={title} className={styles.img} src={image} />
        )}
        <div>
          {deviceType === "desktop" && (
            <img alt={title} className={styles.img} src={image} />
          )}
          <div className={styles.description}>
            <h3 className={styles.title}>{title}</h3>
            <span className={[styles.subtitle, "normal-text"].join(" ")}>
              {subtitle}
            </span>
          </div>
          {deviceType === "mobile" && buttonText && (
            <span className={styles["button-text"]}>{buttonText}</span>
          )}
        </div>
        {deviceType === "desktop" && buttonText && (
          <span className={styles["button-text"]}>{buttonText}</span>
        )}
      </a>
    </Link>
  );
};

export default ServiceCard;

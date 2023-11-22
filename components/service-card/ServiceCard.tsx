import { FunctionComponent } from "react";
import styles from "./ServiceCard.module.scss";
import Link from "next/link";

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
  return (
    <Link href={url || "#"}>
      <a className={[styles["service-card"], className].join(" ")}>
        <div>
          <img alt={title} className={styles.img} src={image} />
          <div className={styles.description}>
            <h3 className={styles.title}>{title}</h3>
            <span className={[styles.subtitle, "normal-text"].join(" ")}>
              {subtitle}
            </span>
          </div>
        </div>
        {buttonText && (
          <span className="primary-color underline larger">{buttonText}</span>
        )}
      </a>
    </Link>
  );
};

export default ServiceCard;

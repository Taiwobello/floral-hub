import React from "react";
import styles from "./Breadcrumb.module.scss";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <ul className={styles.breadcrumb}>
      {items.map((item, index) => (
        <li key={index} className={[styles["breadcrumb-item"]].join(" ")}>
          {item.link ? (
            <Link href={item.link}>
              <a
                className={[
                  index !== items.length - 1 && "underline thin",
                  styles.label
                ].join(" ")}
              >
                {item.label}
              </a>
            </Link>
          ) : (
            <span className={styles.label}>{item.label}</span>
          )}
          {index !== items.length - 1 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={[styles.icon, "generic-icon medium"].join(" ")}
            >
              <path
                d="M9.7023 18.0104L15.7127 12L9.7023 5.98959L8.28809 7.40381L12.8843 12L8.28809 16.5962L9.7023 18.0104Z"
                fill="#2E3A59"
              />
            </svg>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumb;

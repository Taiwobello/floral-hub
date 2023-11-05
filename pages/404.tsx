import React from "react";
import Link from "next/link";
import BlogCard from "../components/blog-card/BlogCard";
import FlowerCard from "../components/flower-card/FlowerCard";
import { blogPosts, popularSections } from "../utils/constants";
import useDeviceType from "../utils/hooks/useDeviceType";
import styles from "./404.module.scss";

function Custom404Page() {
  const deviceType = useDeviceType();
  return (
    <section className="">
      <div className={styles["not-found"]}>
        <div className={styles["text"]}>
          <p>Oops</p>
          <p className="text-medium">Page not found</p>
          <p>
            We couldn’t find the page you were looking for. Please crosscheck
            your URL. If this issue persists, kindly contact us.
          </p>
          <Link href="/">
            <button className="button">GO TO HOME</button>
          </Link>
        </div>
      </div>
      <div className={styles["popular-sections"]}>
        <h2 className={styles.title}>Popular Sections</h2>
        <div className={[styles.section, styles.wrap].join(" ")}>
          {popularSections.map(section => (
            <FlowerCard
              key={section.title}
              image={section.image}
              name={section.title}
              url={section.url}
              mode="four-x-grid"
              onlyTitle
              buttonText="Add to cart"
            />
          ))}
        </div>
        {deviceType === "desktop" && (
          <div className="featured-content">
            <h2 className="featured-title text-center margin-bottom spaced">
              Our Blog
            </h2>
            <div className={styles.section}>
              {blogPosts.map(post => (
                <BlogCard
                  key={post.title}
                  title={post.title}
                  readDuration={post.readDuration}
                  date={post.date}
                  image={post.image}
                  excerpt={post.excerpt}
                  url="#"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Custom404Page;

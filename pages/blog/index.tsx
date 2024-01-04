import React, { FunctionComponent } from "react";
import useScrollCheck from "../../utils/hooks/useScrollCheck";
import styles from "./index.module.scss";
import Button from "../../components/button/Button";
import { blogCategories, blogMinimals } from "../../utils/constants";
import Link from "next/link";

const BlogPage: FunctionComponent = () => {
  const hasScrolled = useScrollCheck();
  return (
    <section
      className={`page-content ${styles["blog-page"]} ${hasScrolled &&
        styles["has-scrolled"]}`}
    >
      <div className={[styles["hero-bg"]].join(" ")}>
        <div
          className={[
            "hero-content flex column center",
            styles["hero-content"]
          ].join(" ")}
        >
          <h1 className={styles.title}>
            5 Reasons Why Guys Give Girls Flowers
          </h1>
          <p className={styles.subtitle}>
            Chivalry isn’t dead, and men are typically known to give women
            flowers, while women are typically known to receive flowers. Or so
            the saying goes. But why exactly do men send women flowers?
          </p>
          <div>
            <Button minWidth={true}>Continue Reading</Button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <p className="text-extra-large uppercase margin-bottom spaced">
          Blog Categories
        </p>

        {blogCategories.map((category, index) => (
          <div key={index} className={styles.category}>
            <span
              className={[
                styles["list-bullet"],
                styles[category.bulletColor]
              ].join(" ")}
            ></span>
            <p className="text-regular">{category.title}</p>
          </div>
        ))}

        <p className={styles.title}>Trending Blog Posts See All</p>
        <div className={styles.blogs}>
          {blogMinimals.map((blog, index) => (
            <Link href={blog.slug} key={index}>
              <a className={styles.blog}>
                <img
                  className={styles["blog-image"]}
                  src={blog.featuredImage}
                  alt="blog image"
                />
                <div className="flex between center-align">
                  <p className={styles["blog-category"]}>{blog.category}</p>
                  <p className={styles["read-mins"]}>
                    {blog.readMinutes} mins read
                  </p>
                </div>
                <p className={styles["blog-title"]}>{blog.title}</p>
                <p className={styles.excerpt}>{blog.excerpt}</p>
                <></>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;

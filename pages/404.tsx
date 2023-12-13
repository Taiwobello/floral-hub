import { GetStaticProps } from "next";
import React, { FunctionComponent } from "react";
import BlogCard from "../components/blog-card/BlogCard";
import FlowerCard from "../components/flower-card/FlowerCard";
import Product from "../utils/types/Product";
import { blogPosts, featuredSlugs } from "../utils/constants";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import useDeviceType from "../utils/hooks/useDeviceType";
import styles from "./404.module.scss";
import Button from "../components/button/Button";

const Custom404Page: FunctionComponent<{ featuredFlowers: Product[] }> = ({
  featuredFlowers
}) => {
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
          <div className={styles["button"]}>
            <Button className="" url="/">
              GO TO HOME
            </Button>
          </div>
        </div>
      </div>
      <div className={styles["popular-sections"]}>
        <h2 className={`${styles.title} vertical-margin spaced normal`}>
          BEST SELLING FLOWERS
        </h2>
        <div className={[styles.section, styles.wrap].join(" ")}>
          {featuredFlowers?.map(flower => (
            <FlowerCard
              key={flower.key}
              image={flower.images[0]?.src || ""}
              name={flower.name}
              subTitle={flower.subtitle || flower.name.split("–")[1]}
              price={flower.price}
              url={`/product/${flower.slug}`}
              buttonText="Add to Cart"
              cart={flower.variants?.length ? false : true}
              product={flower}
            />
          ))}
        </div>
        {deviceType === "desktop" && (
          <div className="featured-content">
            <h2
              className={`${styles.title} featured-title margin-bottom spaced normal`}
            >
              OUR BLOG
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
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs["featured-birthday"]
  );
  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }
  return {
    props: {
      featuredFlowers: data || []
    },
    revalidate: 1800
  };
};

export default Custom404Page;

import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import useScrollCheck from "../../utils/hooks/useScrollCheck";
import styles from "./index.module.scss";
import Button from "../../components/button/Button";
import {
  blogCategories,
  blogMinimals,
  blogPosts,
  featuredSlugs
} from "../../utils/constants";
import Link from "next/link";
import useDeviceType from "../../utils/hooks/useDeviceType";
import Product from "../../utils/types/Product";
import { getProductsBySlugs } from "../../utils/helpers/data/products";
import FlowerCard from "../../components/flower-card/FlowerCard";
import BlogCard from "../../components/blog-card/BlogCard";
import Input from "../../components/input/Input";
import { subscribeToNewsletter } from "../../utils/helpers/data/core";
import SettingsContext from "../../utils/context/SettingsContext";

const BlogPage: FunctionComponent = () => {
  const hasScrolled = useScrollCheck();
  const deviceType = useDeviceType();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { notify } = useContext(SettingsContext);

  const fetchFeaturedProducts = async () => {
    const { data, error, message } = await getProductsBySlugs(
      featuredSlugs["featured-birthday"]
    );
    if (error) {
      console.error("Unable to fetch products by slugs: ", message);
    } else {
      setFeaturedProducts(data || []);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleEmailSubscription = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    const { error, message } = await subscribeToNewsletter(subscriptionEmail);
    setIsSubscribing(false);
    if (error) {
      notify("error", `Unable to subscribe email: ${message}`);
      return;
    }
    notify("success", "Successfully subscribed to newsletter");
  };

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
            <Button minWidth className={styles["hero-btn"]}>
              Continue Reading
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <p className={[styles.title, "margin-bottom spaced"].join(" ")}>
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

        <p className={styles.title}>Trending Blog Posts</p>
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
      <div className={[styles["full-width-section"]].join(" ")}>
        <div className={styles.left}>
          <h2 className={styles["featured-subtitle"]}>Featured Post</h2>
          <h3 className={styles.title}>
            5 Reasons Why Guys Give Girls Flowers
          </h3>
          <span className={styles.subtitle}>
            Chivalry isn’t dead, and men are typically known to give women
            flowers, while women are typically known to receive flowers. Or so
            the saying goes. But why exactly do men send women flowers? Chivalry
            isn’t dead, and men are typically known to give women flowers, while
            women are typically known to receive flowers. Or so the saying goes.
            But why exactly do men send women...
          </span>
          <div>
            <Button minWidth>Continue Reading</Button>
          </div>
        </div>
        {deviceType === "desktop" && (
          <img
            className={styles.right}
            src="/images/blogging-summary.png"
            alt="review"
          />
        )}
      </div>
      <section className="featured-section-wrapper">
        <div className="featured-content">
          <div className="flex between center-align">
            <h2 className="featured-title text-center margin-bottom spaced">
              Everything Flowers & Gifts
            </h2>
            {deviceType === "desktop" && (
              <Button
                url="/product-category/flowers-to-say-thanks-sorry-etc"
                className="flex spaced center-align"
                type="plain"
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}
          </div>
          <div className={[styles.section, styles.wrap].join(" ")}>
            {blogPosts.map(post => (
              <BlogCard
                key={post.title}
                title={post.title}
                readDuration={post.readDuration}
                date={post.date}
                image={post.image}
                excerpt={post.excerpt}
                url="#"
                rowDisplay
              />
            ))}
          </div>
          {deviceType === "mobile" && (
            <Button
              url="/product-category/flowers-to-say-thanks-sorry-etc"
              type="accent"
              className="min-width auto-center margin-bottom spaced"
            >
              <h3 className="red margin-right">See More</h3>
            </Button>
          )}
          <div className="flex between center-align">
            <h2 className="featured-title text-center margin-bottom spaced">
              Fun & Love Tips
            </h2>
            {deviceType === "desktop" && (
              <Button
                url="/product-category/flowers-to-say-thanks-sorry-etc"
                className="flex spaced center-align"
                type="plain"
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}
          </div>
          <div className={[styles.section, styles.wrap].join(" ")}>
            {blogPosts.map(post => (
              <BlogCard
                key={post.title}
                title={post.title}
                readDuration={post.readDuration}
                date={post.date}
                image={post.image}
                excerpt={post.excerpt}
                url="#"
                rowDisplay
              />
            ))}
          </div>
          {deviceType === "mobile" && (
            <Button
              url="/product-category/flowers-to-say-thanks-sorry-etc"
              type="accent"
              className="min-width auto-center margin-bottom spaced"
            >
              <h3 className="red margin-right">See More</h3>
            </Button>
          )}

          <div className="flex between">
            <h2 className="featured-title">Featured Flowers</h2>
            {deviceType === "desktop" && (
              <Button
                url="/product-category/flowers-to-say-thanks-sorry-etc"
                className="flex spaced center-align"
                type="plain"
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}
          </div>
          <div className={[styles.section, styles.wrap].join(" ")}>
            {featuredProducts.map(product => (
              <FlowerCard
                key={product.key}
                image={product.images[0]?.src || ""}
                name={product.name.split("–")[0]}
                subTitle={product.subtitle || product.name.split("–")[1]}
                price={product.price}
                url={`/product/${product.slug}`}
                buttonText="Select Size"
                cart={product.variants?.length ? false : true}
                product={product}
              />
            ))}
          </div>
          {deviceType === "mobile" && (
            <Button
              url="/product-category/flowers-to-say-thanks-sorry-etc"
              type="plain"
              minWidth
              className={styles["see-all"]}
            >
              <h3 className="red margin-right">Browse All Flowers</h3>
              <img alt="see all" src="/icons/arrow-right.svg" />
            </Button>
          )}
          <div className={styles["subscribe-section"]}>
            <div className="flex column between">
              <div className="flex column spaced">
                <h2 className="featured-title unspaced">
                  Stay Updated With Our Newsletter
                </h2>
                <div className="grayed">
                  Get blog updates and special deals direct to your inbox
                </div>
              </div>
              <div className={styles["subscribe-form-wrapper"]}>
                <span className="grayed semibold">Subscribe to updates</span>
                <form
                  className={`flex spaced responsive`}
                  onSubmit={handleEmailSubscription}
                >
                  <Input
                    value={subscriptionEmail}
                    onChange={setSubscriptionEmail}
                    className="full-width"
                    placeholder="Enter email address"
                    icon="/icons/envelope.svg"
                    required
                    type="email"
                    name="email"
                  />
                  <Button buttonType="submit" loading={isSubscribing}>
                    SUBSCRIBE
                  </Button>
                </form>
              </div>
            </div>
            <img
              className={styles["subscribe-img"]}
              alt="subscribe"
              src="/images/subscribe-img.png"
            />
          </div>
        </div>
      </section>
    </section>
  );
};

export default BlogPage;

import React, {
  useState,
  useContext,
  FormEvent,
  FunctionComponent
} from "react";
import styles from "./blog.module.scss";
import articleStyles from "./article.module.scss";
import { GetStaticProps } from "next";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { subscribeToNewsletter } from "../../utils/helpers/data/core";
import SettingsContext from "../../utils/context/SettingsContext";
import { blogCategories, blogMinimals } from "../../utils/constants";
import { trendingPosts } from "../../utils/constants";
import BlogThumbnail from "./_blogThumbnail";
import { getProductsBySlugs } from "../../utils/helpers/data/products";
import { featuredSlugs } from "../../utils/constants";
import Product from "../../utils/types/Product";
import FlowerCard from "../../components/flower-card/FlowerCard";

const BlogPost: FunctionComponent<{ featuredFlowers: Product[] }> = ({
  featuredFlowers
}) => {
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { notify } = useContext(SettingsContext);
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
    <section className={styles["blog-post"]}>
      <div className={styles["hero-header"]}>
        <p className={styles["title"]}>
          {" "}
          5 Reasons Why Guys Give Girls Flowers
        </p>
        <div className={styles["header-details"]}>
          <div className={`${styles["info"]} text-medium`}>
            <p>
              <span className={styles["blog-date"]}>7 Dec, 2021 / </span>{" "}
              <span className={styles["last-updated"]}>
                {" "}
                Updated 4 hours ago
              </span>
            </p>
            <p>
              <span className={styles["read-duration"]}>10 minutes read </span>{" "}
              <span className={styles["tag"]}> Everything Flowers & Gift</span>
            </p>
          </div>
          <div className={`${styles["quick-action"]} text-medium`}>
            <div>
              <img src="/icons/copy.svg" alt="" className={styles["copy"]} />{" "}
              Copy link
            </div>
            <div>
              <img
                src="/icons/twitter-blog.svg"
                alt=""
                className={styles["copy"]}
              />
            </div>
            <div>
              <img
                src="/icons/facebook-blog.svg"
                alt=""
                className={styles["copy"]}
              />
            </div>
            <div>
              <img
                src="/icons/instagram-blog.svg"
                alt=""
                className={styles["copy"]}
              />
            </div>
          </div>
        </div>
        <div className={styles["hero-img"]}></div>
      </div>

      <div className={styles["blog-body"]}>
        <div className={styles["content"]}>
          <h1>Service online and help</h1>
          <article className={`text-small ${articleStyles["article"]}`}>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus id quod maxime placeat
            facere possimus, omnis voluptas assumenda est, om
            <blockquote>
              {" "}
              <q>
                Lorem Ipsum At vero eos et accusamus et iusto odio dignissimos
                ducimus qui blanditiis
              </q>
              <cite>Manuel Snr, Product Designer</cite>
            </blockquote>
            <div>
              <img src="/images/blog-image.png" alt="" />
              <img src="/images/blog-image.png" alt="" />
              <img src="/images/blog-image.png" alt="" />
            </div>
          </article>
        </div>
        <div className={styles["side"]}>
          <div className={styles["trending"]}>
            <hr />
            <p>Trending Posts</p>
            <hr />
          </div>
          {trendingPosts.map((tag, index) => (
            <BlogThumbnail
              imageUrl={tag.imageUrl}
              tag={tag.tag}
              title={tag.title}
              key={index}
            />
          ))}
          <div className={styles["trending"]}>
            <hr />
            <p>Blog Categories</p>
            <hr />
          </div>
          {blogCategories.map((category, index) => (
            <div key={index} className={styles.category}>
              <span
                className={[
                  styles["list-bullet"],
                  styles[category.bulletColor]
                ].join(" ")}
              ></span>
              <p className="text-medium">{category.title}</p>
            </div>
          ))}
          <div className={styles["trending"]}>
            <hr />
            <p>Recent Posts</p>
            <hr />
          </div>
          {trendingPosts.map((tag, index) => (
            <BlogThumbnail
              imageUrl={tag.imageUrl}
              tag={tag.tag}
              title={tag.title}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className={styles["comment"]}>
        <p>Comments</p>
        <div>
          <p className="text-small">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga
          </p>
        </div>
        <p className="flex">
          <span> Janel Thompson </span>
          <span> 18 August, 2021</span>
        </p>
      </div>

      <div className={styles["add-comment"]}>
        <p>Leave a comment</p>
        <form action="" method="post">
          <textarea
            name=""
            id=""
            cols={30}
            rows={10}
            placeholder="Comment"
          ></textarea>
          <div>
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
            />
          </div>

          <Button>POST COMMENT</Button>
        </form>
      </div>

      <div className={styles["popular-sections"]}>
        <h2 className={`${styles.title} vertical-margin spaced normal`}>
          FEATURED FLOWERS
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
              buttonText="Select Size"
              cart={flower.variants?.length ? false : true}
              product={flower}
            />
          ))}
        </div>
      </div>

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
    </section>
  );
};

export default BlogPost;

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

export const getStaticPaths = async () => {
  // const { data, error } = await getAllProducts();
  // const slugs = data?.map( blog => ({
  //   params: { blogSlug: blog.slug }
  // }));

  // if (error) {
  //   console.error(`Unable to fetch products: ${error}`);
  //   return {
  //     paths: [],
  //     fallback: false
  //   };
  // } else {
  //   return {
  //     paths: slugs,
  //     fallback: false // true or 'blocking'
  //   };
  // }
  return {
    paths: [
      {
        params: {
          blogSlug: "blogSlug"
        }
      } // See the "paths" section below
    ],
    fallback: true // false or "blocking"
  };
};

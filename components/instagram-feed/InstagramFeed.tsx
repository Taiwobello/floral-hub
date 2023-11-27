import { FunctionComponent, useContext, useEffect, useState } from "react";
import styles from "./InstagramFeed.module.scss";
import { getInstagramPosts } from "../../utils/helpers/data/instagram";
import SettingsContext from "../../utils/context/SettingsContext";
import { InstagramPost } from "../../utils/types/Instagram";

interface InstagramFeedProps {
  accessToken: string;
  /**
   * Delay period in milliseconds
   */
  delayBeforeFetching?: number;
}

const renderIgPost = (post: InstagramPost, heightFactor: number) => (
  <a
    key={post.id}
    href={post.permalink}
    className={styles.post}
    style={{ height: `${4 * heightFactor}rem` }}
    target="_blank"
    rel="noreferrer"
  >
    <img
      src={post.mediaUrl}
      className={styles["post-img"]}
      alt="instagram post by floralhub.com.ng"
    />
    <span className={styles["post-author"]}>@floralhub.com.ng</span>
  </a>
);

const InstagramFeed: FunctionComponent<InstagramFeedProps> = ({
  accessToken,
  delayBeforeFetching = 0
}) => {
  const [igPosts, setIgPosts] = useState<InstagramPost[]>([]);

  const { notify } = useContext(SettingsContext);

  useEffect(() => {
    const fetchIgContent = async () => {
      const { error, message, data } = await getInstagramPosts({
        accessToken,
        count: 5
      });
      if (error) {
        notify("error", `Unable to fetch instagram feed: ${message}`);
      }
      setIgPosts(data || []);
    };

    setTimeout(fetchIgContent, delayBeforeFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayBeforeFetching, accessToken]);
  return igPosts.length ? (
    <section className={styles.wrapper}>
      <h2 className="featured-title text-center">INSTAGRAM INSPIRATION</h2>
      <div className={styles.posts}>
        {igPosts.map((post, i) => {
          const heightFactorMap: Record<number, number> = {
            0: 12,
            1: 6,
            2: 6,
            3: 4,
            4: 8
          };
          return renderIgPost(post, heightFactorMap[i]);
        })}
      </div>
    </section>
  ) : null;
};

export default InstagramFeed;

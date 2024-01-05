import React from 'react'
import styles from './blog.module.scss'
const BlogPost = ({ params }: { params: { blogSlug: string } }) => {
  return (
    <section className={styles["blog-post"]}>

      <div className={styles["hero-header"]}>
        <p className={styles["title"]}> 5 Reasons Why Guys Give Girls Flowers</p>
        <div className={styles["header-details"]}>
        
          <div className={`${styles["info"]} text-medium`}>
            <p><span className={styles["blog-date"]}>7 Dec, 2021 / </span> <span className={styles["last-updated"]}> Updated 4 hours ago</span></p>
            <p><span className={styles["read-duration"]}>10 minutes read </span> <span className={styles["tag"]}> Everything Flowers & Gift</span></p>
          </div>
          <div className={`${styles['quick-action']} text-medium`}>
            <div><img src="/icons/copy.svg" alt="" className={styles["copy"]} /> Copy link</div>
            <div><img src="/icons/twitter-blog.svg" alt="" className={styles["copy"]} /></div>
            <div><img src="/icons/facebook-blog.svg" alt="" className={styles["copy"]} /></div>
            <div><img src="/icons/instagram-blog.svg" alt="" className={styles["copy"]} /></div>
          
          </div>
        </div>
        <div className={styles["hero-img"]}></div>
      </div>

      <div className={styles["blog-body"]}>
        <div className=""></div>
        <div className=""></div>
      </div>
    </section>
  )
}

export default BlogPost
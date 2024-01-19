import Head from "next/head";
import { websiteUrl } from "../../utils/constants";

interface MetaProps {
  canonicalUrl?: string;
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  imageAlt?: string;
  url?: string;
}

const Meta = ({
  canonicalUrl,
  title,
  description,
  image,
  children,
  imageAlt,
  url
}: MetaProps) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      <title>{title ? title : "Floral Hub"}</title>

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta
        name="description"
        content={`${
          description
            ? description
            : "Same Day Fresh Flowers and Gifts Delivery In Lagos and Abuja, Nigeria"
        }`}
      />

      <base href="https://floralhub.ng/" />

      {/* Open Graph Meta Tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {
        <meta
          property="og:image"
          content={
            image
              ? image
              : "https://firebasestorage.googleapis.com/v0/b/floralhub-cdn/o/flroal-homepage-opengragh-image.jpg.jpg?alt=media&token=ccaf55e8-cc14-4ccb-a92d-9ba8b280c212"
          }
        />
      }
      {imageAlt && <meta property="og:image:alt" content={imageAlt}></meta>}
      <meta property="og:url" content={`${url ? url : websiteUrl}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Floral Hub"></meta>

      {/* Twitter Card Meta Tags */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {children}
    </Head>
  );
};

export default Meta;

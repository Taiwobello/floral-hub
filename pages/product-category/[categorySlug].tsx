import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent, useEffect } from "react";
import { getCategories, getCategory } from "../../utils/helpers/data/category";
import ProductsPage from "../filters";
import { Category } from "../../utils/types/Category";
import Meta from "../../components/meta/Meta";
import { occasionsPageMetaData, websiteUrl } from "../../utils/constants";

const CategoryPage: FunctionComponent<{
  category?: Category;
}> = ({ category }) => {
  useEffect(() => {
    if (!category?.slug) {
      window.location.reload();
    }
  }, [category]);
  return (
    <>
      <Meta
        canonicalUrl={`${websiteUrl}/product-category/${category?.slug}`}
        description={
          occasionsPageMetaData[category?.slug || "all"] &&
          occasionsPageMetaData[category?.slug || "all"].description
        }
        title={
          occasionsPageMetaData[category?.slug || "all"] &&
          occasionsPageMetaData[category?.slug || "all"].title
        }
      ></Meta>
      <ProductsPage
        productCategory="occasion"
        categorySlug={category?.slug || "all"}
        category={category}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.categorySlug as string;

  if (categorySlug === "all") {
    return {
      props: {
        category: {
          name: "All",
          slug: "all",
          description: "All Products",
          image: ""
        }
      }
    };
  }

  const { error, message, data } = await getCategory(categorySlug);

  if (error) {
    console.error("Unable to fetch Category", message);

    return {
      props: {
        category: {
          name: "",
          title: "",
          slug: ""
        }
      }
    };
  }
  return {
    props: {
      category: data
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { error, message, data } = await getCategories({
    pageNumber: 1,
    pageSize: 1000
  });
  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }
  return {
    paths: (
      data?.map(category => ({
        params: { categorySlug: category.slug }
      })) || []
    ).concat({ params: { categorySlug: "all" } }),
    fallback: false // true or 'blocking'
  };
};

export default CategoryPage;

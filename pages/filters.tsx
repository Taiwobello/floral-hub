import {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getProductsByCategory } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import Checkbox from "../components/checkbox/Checkbox";
import FlowerCard from "../components/flower-card/FlowerCard";
import {
  FilterOption,
  breadcrumbItems,
  bridalOccasionFilters,
  defaultBreadcrumb,
  filtersCatgories,
  funeralOccasion,
  giftItems,
  regalWebsiteUrl,
  sortOptions,
  tagsMap
} from "../utils/constants";
import Select from "../components/select/Select";
import {
  FetchResourceParams,
  SortLogic
} from "../utils/types/FetchResourceParams";
import useScrollHandler from "../utils/hooks/useScrollHandler";
import useDeviceType from "../utils/hooks/useDeviceType";
import Button from "../components/button/Button";
import useOutsideClick from "../utils/hooks/useOutsideClick";
import styles from "./filters.module.scss";
import SettingsContext from "../utils/context/SettingsContext";
import Radio from "../components/radio/Radio";
import Input from "../components/input/Input";
import Meta from "../components/meta/Meta";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { Category } from "../utils/types/Category";
import { InfoIcon } from "../utils/resources";

const giftMap: Record<string, string> = {
  "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears":
    "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears",
  "chocolate-and-biscuits": "chocolate-and-biscuits",
  "cakes-and-cupcakes": "cakes-and-cupcakes",
  "teddy-bears": "teddy-bears",
  "wine-and-champagne": "wine-and-champagne",
  "gift-packs": "gift-packs",
  perfumes: "perfumes",
  balloons: "balloons",
  "scented-candles": "scented-candles",
  gifts: "gifts",
  "gift-sets": "gift-sets"
};

type ProductClass = "vip" | "regular";

export interface ProductFilterLogic {
  category: string[];
  productClass?: ProductClass;
  budget?: string[];
  design?: string[];
  flowerType?: string[];
  flowerName?: string[];
  packages?: string[];
  delivery?: string[];
}

const JustToSayTexts = ["Sorry", "Hi", "Thank You", "Congrats", "Etc"];

type ProductCategory = "vip" | "occasion";

type Sort = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const ProductsPage: FunctionComponent<{
  productCategory: ProductCategory;
  categorySlug: string;
  productClass?: ProductClass;
  category?: Category;
}> = props => {
  const {
    productCategory = "occasion",
    categorySlug,
    productClass,
    category
  } = props;

  const bridalCategories = [
    "cascading-bridal-bouquets",
    "accessories-boutonnieres-bridesmaids-flowers-corsages",
    "bridal-bouquets"
  ];
  const funeralCategories = ["funeral-and-condolence"];

  const _filterCategories =
    categorySlug === "all"
      ? []
      : bridalCategories.includes(categorySlug as string)
      ? bridalOccasionFilters
      : funeralCategories.includes(categorySlug as string)
      ? funeralOccasion
      : filtersCatgories;

  const router = useRouter();
  const { query, isReady } = router;
  const { selectedOccasion, shopBy, search } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>(["regular"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(1);
  const [, setJustToSayText] = useState(JustToSayTexts[0]);

  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [filterCategories, setFilterCategories] = useState(_filterCategories);
  const [sort, setSort] = useState<Sort>("name-asc");
  const [hasMore, setHasMore] = useState(false);
  const [shouldShowFilter, setShouldShowFilter] = useState(false);
  const [, setUpdateHeroContent] = useState("");

  const filterDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setShouldShowFilter(false);
  });

  const isGiftPage = giftMap[categorySlug as string];

  const {
    notify,
    setRedirectUrl,
    setBreadcrumb,
    searchText,
    setSearchText
  } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const selectedBreadcrumb = breadcrumbItems.find(_breadcrumb =>
    categorySlug
      ? _breadcrumb.url === categorySlug
      : _breadcrumb.url === productCategory
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const [
    lastProductEleRef,
    setLastProductEleRef
  ] = useState<HTMLAnchorElement | null>(null);

  const [page, setPage] = useScrollHandler({
    node: lastProductEleRef
  });
  const hideFilterInfo = [
    ...bridalCategories,
    ...funeralCategories,
    "all",
    "indoor-plants-and-cactus"
  ].includes(categorySlug as string);

  const hideFilterList = ["all", "indoor-plants-and-cactus"];

  const hideFilters =
    isGiftPage || hideFilterList.includes(categorySlug as string) || search;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    router.push(`/filters?search=${searchText}`, undefined, {
      scroll: false
    });
  };

  const shuffleText = () => {
    if (count < JustToSayTexts.length - 1) {
      setJustToSayText(JustToSayTexts[count]);
      setCount(count + 1);
    } else {
      setCount(0);
      setJustToSayText(JustToSayTexts[count]);
    }
  };
  const changeHeroContent = () => {
    const url = window.location.href.split("/").slice(3);
    if (url[1] == "indoor-plants-and-cactus") {
      setUpdateHeroContent("Indoor Plants and Cactus");
    } else {
      const content = breadcrumbItems.find(
        value => url[1] === value.url || url[0] === value.url
      );
      content
        ? setUpdateHeroContent(content.label)
        : setUpdateHeroContent("Romance, Birthdays & Anniversary");
    }
  };
  const handleClearFIlter = () => {
    setSelectedFilter([]);
    router.push(`/product-category/${categorySlug}`, undefined, {
      scroll: false
    });
  };

  const fetchProductCategory = async (shouldAppend?: boolean) => {
    if (shouldAppend) {
      setInfiniteLoading(true);
    } else {
      setProductsLoading(true);
    }

    const sortParams: SortLogic = {
      sortField: sort.split("-")[0],
      sortType: sort.split("-")[1] as "asc" | "desc"
    };

    let params: FetchResourceParams<ProductFilterLogic> = {
      pageNumber: page,
      sortLogic: sortParams
    };

    if (search) {
      params = {
        ...params,
        searchValue: search as string,
        searchField: "name"
      };
    } else {
      const shopByArray = String(shopBy).split(",");

      const tagFilters: Record<string, string[]> = shopBy
        ? shopByArray.reduce((map: Record<string, string[]>, tag) => {
            const tagKey = Object.keys(tagsMap).find(key => {
              return tagsMap[key].includes(tag);
            });
            if (tagKey) {
              map[tagKey] = [...(map[tagKey] || []), tag];
            }
            return map;
          }, {})
        : isGiftPage || hideFilterInfo
        ? {}
        : {
            budget: productClass == "vip" ? ["vip"] : ["regular"]
          };

      const filterParams = {
        category: [
          !["vip-flowers", "all"].includes(categorySlug || "")
            ? categorySlug || ""
            : ""
        ],
        productClass,
        ...tagFilters
      };

      params = {
        ...params,
        filter: filterParams
      };
    }

    const response = await getProductsByCategory(params);
    setProductsLoading(false);
    setInfiniteLoading(false);
    if (response.error) {
      notify("error", `Unable to fetch product category: ${response.message}`);
    } else {
      setHasMore((response.data as Product[]).length > 0);

      setProducts(
        shouldAppend
          ? [...products, ...(response.data as Product[])]
          : (response.data as Product[])
      );
    }
  };

  const handleFilterChange = (filter: FilterOption) => {
    const newFilters = selectedFilter.includes(filter.tag || "")
      ? selectedFilter.filter(_filter => _filter !== filter.tag)
      : [...selectedFilter, filter.tag];
    setSelectedFilter(newFilters.filter(Boolean) as string[]);
    console.log("called 1");
    setProductsLoading(true);

    const url = categorySlug
      ? `${
          categorySlug !== "vip-flowers" ? "/product-category" : ""
        }/${categorySlug}?shopBy=${newFilters.join(",")}`
      : `/filters?shopBy=${newFilters.join(",")}`;
    router.push(url, undefined, { scroll: false });
  };

  useEffect(() => {
    if (isReady && search) {
      setSearchText(search as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (isReady) {
      const filters = shopBy
        ? String(shopBy || "")
            .split(",")
            .filter(Boolean)
        : productClass !== "vip"
        ? ["regular"]
        : [];

      setSelectedFilter([...filters]);
      shopBy && setShouldShowFilter(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopBy]);

  useEffect(() => {
    if (productClass === "vip") {
      setSelectedFilter(["vip"]);
    }
  }, [productClass]);

  useEffect(() => {
    const intervalId = setInterval(shuffleText, 3000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (isReady) {
      if (page === 1) {
        fetchProductCategory();
      } else {
        fetchProductCategory(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (productCategory === "vip") {
      const filteredCategory = filterCategories.filter(
        item => item.name.toLowerCase() !== "budget"
      );
      setFilterCategories(filteredCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOccasion]);

  useEffect(() => {
    if (isReady) {
      setFilterCategories(_filterCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, isReady]);

  useEffect(() => {
    if (isReady) {
      setPage(1);
      fetchProductCategory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, selectedOccasion, sort, shopBy, search, isReady]);

  useEffect(() => {
    if (isReady) {
      setRedirectUrl(router.asPath);
      changeHeroContent();
      setBreadcrumb(
        selectedBreadcrumb
          ? {
              label: selectedBreadcrumb.label,
              url: router.asPath
            }
          : defaultBreadcrumb
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [search]);

  useEffect(() => {
    if (category) {
      const categoryDescription = document.getElementById(
        "category-description"
      );
      if (categoryDescription) {
        categoryDescription.innerHTML = category?.description.replace(
          "<p>&nbsp;</p>",
          ""
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  const hideHero = search;

  return (
    <>
      {router.pathname === "/filters" && (
        <Meta
          canonicalUrl={`${regalWebsiteUrl}/product-category/anniversary-flowers`}
        ></Meta>
      )}
      <section className={styles.filters} ref={rootRef}>
        {!hideHero && (
          <div className={[styles["hero-bg"]].join(" ")}>
            <div className={`hero-content flex column `}>
              {deviceType === "desktop" && (
                <>
                  <div className={styles["hero-text"]}>
                    <Breadcrumb
                      items={[
                        { label: "Home", link: "/" },
                        { label: category?.topHeading || "" }
                      ]}
                    />

                    <p className="vertical-margin spaced uppercase">
                      {category?.topHeading}
                    </p>
                    <p className="text-medium">{category?.heroDescription}</p>
                    {category?.info && (
                      <div
                        className={`flex spaced center-align text-medium ${styles["info"]}`}
                      >
                        <InfoIcon fill="#B240DA" />
                        <span>{category.info}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles["hero-image"]}></div>
                </>
              )}
              {deviceType === "mobile" && (
                <div className={styles["occasions-mobile"]}>
                  <div className={`text-medium ${styles["mobile-card"]}`}>
                    <Breadcrumb
                      items={[
                        { label: "Home", link: "/" },
                        { label: category?.topHeading || "" }
                      ]}
                    />
                    <p className="vertical-margin spaced uppercase">
                      {category?.topHeading}
                    </p>
                    {category?.heroDescription}
                    {category?.info && (
                      <div
                        className={`flex spaced center-align text-medium ${styles["info"]}`}
                      >
                        <InfoIcon fill="#B240DA" />
                        <span>{category.info}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={`${styles["content"]} flex ${deviceType === "desktop" &&
            "spaced-xl"}`}
        >
          {!hideFilters && (
            <div className={styles["left-side"]}>
              {!hideFilterInfo && (
                <div className="vertical-margin spaced">
                  <span className={`margin-right ${styles["sub-title"]}`}>
                    FILTERS ({selectedFilter.length})
                  </span>
                </div>
              )}

              <div className={styles["filters-sidebar"]}>
                <form
                  onSubmit={handleSearch}
                  className={`input-group ${styles["search-wrapper"]}`}
                >
                  <span className="question normal-text"></span>
                  <Input
                    name="name"
                    placeholder="Search flowers"
                    value={searchText}
                    onChange={value => {
                      setSearchText(value);
                    }}
                    icon="/icons/search.svg"
                    noBorder
                    responsive
                    className={`search`}
                  />
                </form>
                {filterCategories.map((filter, index) => (
                  <div key={index} className="vertical-margin spaced">
                    {filter.name === "Budget" && productClass === "vip" ? (
                      ""
                    ) : (
                      <p className="bold vertical-margin spaced">
                        {filter.name}
                      </p>
                    )}
                    <div>
                      {(filter.viewMore
                        ? filter.options
                        : filter.options.slice(0, filter.limit)
                      ).map((child, i) => (
                        <div key={i} className="margin-bottom text-small">
                          {filter.name === "Budget" ? (
                            productClass !== "vip" ? (
                              <>
                                <div className="margin-bottom">
                                  <Radio
                                    label="Regular"
                                    onChange={() => {
                                      const newFilters = [
                                        ...selectedFilter.filter(filter => {
                                          return filter !== "vip";
                                        }),
                                        "regular"
                                      ];
                                      setSelectedFilter(newFilters);
                                      const url = categorySlug
                                        ? `${
                                            categorySlug !== "vip-flowers"
                                              ? "/product-category"
                                              : ""
                                          }/${categorySlug}?shopBy=${newFilters.join(
                                            ","
                                          )}`
                                        : `/filters?shopBy=${newFilters.join(
                                            ","
                                          )}`;
                                      router.push(url, undefined, {
                                        scroll: false
                                      });
                                    }}
                                    checked={selectedFilter.includes("regular")}
                                  />
                                </div>

                                <Radio
                                  label="VIP"
                                  onChange={() => {
                                    const newFilters = [
                                      ...selectedFilter.filter(filter => {
                                        return filter !== "regular";
                                      }),
                                      "vip"
                                    ];
                                    setSelectedFilter(newFilters);
                                    const url = `/filters?shopBy=${newFilters.join(
                                      ","
                                    )}`;
                                    router.push(url, undefined, {
                                      scroll: false
                                    });
                                  }}
                                  checked={selectedFilter.includes("vip")}
                                />
                              </>
                            ) : (
                              ""
                            )
                          ) : child.link ? (
                            <Link href={child.link}>
                              <a
                                className={[
                                  styles["filter-link"],
                                  child.link ===
                                  `/product-category/${categorySlug}`
                                    ? styles.active
                                    : ""
                                ].join(" ")}
                              >
                                {child.name}
                              </a>
                            </Link>
                          ) : (
                            <Checkbox
                              onChange={() => handleFilterChange(child)}
                              text={child.name}
                              checked={selectedFilter.includes(child.tag || "")}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {filter.limit < filter.options.length && (
                      <button
                        className={styles["btn-view"]}
                        onClick={() => {
                          setFilterCategories(prev =>
                            prev.map((item, _index) => {
                              if (index === _index) {
                                return {
                                  ...item,
                                  viewMore: !item.viewMore
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      >
                        {!filter.viewMore ? "View More" : "View Less"}
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  className="primary-color full-width"
                  onClick={handleClearFIlter}
                >
                  RESET FILTER
                </Button>
              </div>
            </div>
          )}
          <div className={styles["product-wrapper"]}>
            <div
              className={`flex between block center-align normal text-small ${!hideFilters &&
                deviceType === "desktop" &&
                [styles.sorts].join(" ")} ${styles["sorts-mobile"]}`}
            >
              {!hideFilters && (
                <>
                  <div
                    className={`flex between center-align ${
                      hideFilters ? "block" : ""
                    }`}
                  >
                    {deviceType === "desktop" ? (
                      <span className={`question ${styles.question}`}>
                        Sorted By:
                      </span>
                    ) : (
                      " "
                    )}

                    <div className={`normal text-small ${styles.sort}`}>
                      {deviceType === "mobile" ? (
                        <span className={`question ${styles.question}`}>
                          Sort:
                        </span>
                      ) : (
                        " "
                      )}
                      <Select
                        options={sortOptions}
                        value={sort}
                        onSelect={value => setSort(value as Sort)}
                        placeholder="Default"
                        className={`${styles["sort"]}`}
                      />
                    </div>
                  </div>
                  <div
                    className={styles["filter-mobile"]}
                    ref={filterDropdownRef}
                  >
                    <button
                      className={styles.btn}
                      onClick={() => setShouldShowFilter(!shouldShowFilter)}
                    >
                      <h3 className="margin-right">
                        Filter{!hideFilterInfo && `(${selectedFilter.length})`}
                      </h3>
                      <img
                        alt="filter"
                        className="generic-icon medium"
                        src="/icons/filter.svg"
                      />
                    </button>
                    <div
                      className={[
                        styles["filters-dropdown"],
                        shouldShowFilter && styles.active
                      ].join(" ")}
                    >
                      {filterCategories.map((filter, index) => (
                        <div key={index} className="vertical-margin spaced">
                          {filter.name === "Budget" &&
                          productClass === "vip" ? (
                            ""
                          ) : (
                            <p className="bold vertical-margin spaced">
                              {filter.name}
                            </p>
                          )}
                          <div>
                            {(filter.viewMore
                              ? filter.options
                              : filter.options.slice(0, filter.limit)
                            ).map((child, index) => (
                              <div key={index} className="margin-bottom">
                                {filter.name === "Budget" ? (
                                  productClass !== "vip" ? (
                                    <>
                                      <div className="margin-bottom">
                                        <Radio
                                          label="Regular"
                                          onChange={() => {
                                            const newFilters = [
                                              ...selectedFilter.filter(
                                                filter => {
                                                  return filter !== "vip";
                                                }
                                              ),
                                              "regular"
                                            ];
                                            setSelectedFilter(newFilters);
                                            const url = categorySlug
                                              ? `${
                                                  categorySlug !== "vip"
                                                    ? "/product-category"
                                                    : ""
                                                }/${categorySlug}?shopBy=${newFilters.join(
                                                  ","
                                                )}`
                                              : `/filters?shopBy=${newFilters.join(
                                                  ","
                                                )}`;
                                            router.push(url, undefined, {
                                              scroll: false
                                            });
                                          }}
                                          checked={selectedFilter.includes(
                                            "regular"
                                          )}
                                        />
                                      </div>

                                      <Radio
                                        label="VIP"
                                        onChange={() => {
                                          const newFilters = [
                                            ...selectedFilter.filter(filter => {
                                              return filter !== "regular";
                                            }),
                                            "vip"
                                          ];
                                          setSelectedFilter(newFilters);
                                          const url = `/filters?shopBy=${newFilters.join(
                                            ","
                                          )}`;
                                          router.push(url, undefined, {
                                            scroll: false
                                          });
                                        }}
                                        checked={selectedFilter.includes("vip")}
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )
                                ) : child.link ? (
                                  <Link href={child.link}>
                                    <a
                                      className={[
                                        styles["filter-link"],
                                        child.link ===
                                        `/product-category/${categorySlug}`
                                          ? styles.active
                                          : ""
                                      ].join(" ")}
                                    >
                                      {child.name}
                                    </a>
                                  </Link>
                                ) : (
                                  <Checkbox
                                    onChange={() => handleFilterChange(child)}
                                    text={child.name}
                                    checked={selectedFilter.includes(
                                      child.tag || ""
                                    )}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          {filter.limit < filter.options.length && (
                            <button
                              className={styles["btn-view"]}
                              onClick={() => {
                                setFilterCategories(prev =>
                                  prev.map((item, _index) => {
                                    if (index === _index) {
                                      return {
                                        ...item,
                                        viewMore: !item.viewMore
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }}
                            >
                              {!filter.viewMore ? "View More" : "View Less"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <h1 className={`${styles.title} bold vertical-margin spaced`}>
                {search
                  ? `Search Results for "${searchText}"`
                  : category?.bottomHeading
                  ? category.bottomHeading
                  : "All Occasions"}
              </h1>

              <div className={[styles.products].join(" ")}>
                {productsLoading && (
                  <div className={styles.spinner}>
                    <img src="/images/spinner.svg" alt="spinner" />
                  </div>
                )}
                {products?.map((product, index, arr) => (
                  <FlowerCard
                    key={index}
                    name={product.name.split("–")[0]}
                    image={product.images[0].src}
                    slideImages={product["images"]}
                    price={product.price}
                    buttonText="Add to Cart"
                    subTitle={product.subtitle || product.name.split("–")[1]}
                    url={`/product/${product.slug}`}
                    mode={`${
                      deviceType === "desktop"
                        ? hideFilters
                          ? "four-x-grid"
                          : "three-x-grid"
                        : "two-x-grid"
                    }`}
                    ref={
                      index === arr.length - 1
                        ? ele => {
                            if (ele && hasMore && !productsLoading) {
                              setLastProductEleRef(ele);
                            }
                          }
                        : null
                    }
                    product={product}
                    cart={product.variants?.length ? false : true}
                  />
                ))}
              </div>
            </div>
            {infiniteLoading && hasMore && (
              <img
                src="/images/spinner.svg"
                alt="spinner"
                className="generic-icon xl spinner"
              />
            )}
          </div>
        </div>
        <div className={styles.gifts}>
          {!isGiftPage && (
            <>
              <div className="flex between margin-bottom spaced normal">
                <span className={styles.title}>GIFTS TO INCLUDE</span>
                {deviceType === "desktop" && (
                  <Button
                    url="/product-category/gifts"
                    className="flex spaced center center-align"
                    type="transparent"
                  >
                    <h3 className="red margin-right normal text-semilarge">
                      See All
                    </h3>
                  </Button>
                )}
              </div>
              <div className="flex between vertical-margin spaced wrap">
                {giftItems.map((gift, index) => (
                  <FlowerCard
                    key={index}
                    name={gift.name}
                    image={gift.image}
                    subTitle={gift.description}
                    buttonText="VIEW GIFTS"
                    url={gift.slug}
                  />
                ))}
              </div>
              {deviceType === "mobile" && (
                <Button
                  url="/product-category/gifts"
                  type="transparent"
                  minWidth
                  className={`${styles["see-all"]}`}
                >
                  <h3 className="normal text-small">Browse All Gifts</h3>
                  <img
                    alt="arrow"
                    className="generic-icon xsmall"
                    src="/icons/arrow-right.svg"
                  />
                </Button>
              )}{" "}
            </>
          )}
          <div className={styles.stories}>
            <h1 className={`text-center ${styles.title}`}>
              {category?.bottomHeading || "Flower Delivery for all Occasions"}
            </h1>

            <p
              id="category-description"
              className="description category normal-text"
            ></p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;

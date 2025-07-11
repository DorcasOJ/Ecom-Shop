import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  Checkbox,
  Pagination,
  ClickAwayListener,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategorySlice";
import {
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProducts,
  selectProductTotalResults,
  toggleFilters,
} from "../ProductSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  getCartByUserIdAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
} from "../../cart/CartSlice";
import Lottie from "lottie-react";
import {
  loadingAnimation,
  banner1,
  banner2,
  banner3,
  banner4,
} from "../../../assets";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddIcon from "@mui/icons-material/Add";
import { ProductBanner } from "./ProductBanner";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { blue } from "@mui/material/colors";
// import { selectAddresses } from "../../address/AddressSlice";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  resetWishlistItemAddStatus,
  selectWishlists,
} from "../../wishlist/WishlistSlice";
import { ProductCard } from "./ProductCard";
import { toast } from "react-toastify";
import { ITEMS_PER_PAGE } from "../../../constants";
// import Checkbox from "@mui/material/Checkbox";

const sortOptions = [
  {
    name: "Price: low to high",
    sort: "price",
    order: "asc",
  },
  {
    name: "Price: high to low",
    sort: "price",
    order: "desc",
  },
  {
    name: "Newest Arrivals",
    sort: "",
    order: "desc",
  },
  {
    name: "Popularity",
    sort: "",
    order: "asc",
  },
];

const bannerImages = [banner1, banner2, banner3, banner4];

export const ProductList = () => {
  const [filters, setFilters] = useState({ sort: "", order: "" });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const theme = useTheme();

  // console.log(filters, "filters");

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is800 = useMediaQuery(theme.breakpoints.down(800));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const totalResults = useSelector(selectProductTotalResults);
  const loggedInUser = useSelector(selectLoggedInUser);
  const productFetchStatus = useSelector(selectProductFetchStatus);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const wishlistItems = useSelector(selectWishlists);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const dispatch = useDispatch();
  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand);
    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }
    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, brand: filterArray });
  };

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }
    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, category: filterArray });
  };

  const handleFilterClose = () => {
    dispatch(toggleFilters());
  };
  // console.log(products, totalResults);

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex(
        (item) => item.product._id === productId
      );
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };
    finalFilters["pagination"] = { page: page, limit: ITEMS_PER_PAGE };

    if (!loggedInUser?.isAdmin) {
      finalFilters["user"] = true;
    }

    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, page]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("Product added to wishlist");
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("Product removed from wishlist");
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error(
        "Error removing product from wishlist, please try again later"
      );
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (productFetchStatus == "rejected") {
      toast.error("Error fetching products, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {

    return () => {
      dispatch(resetProductFetchStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, []);

  return (
    <>
      {/* filter side bar */}
      {productFetchStatus === "pending" ? (
        <Stack
          width={is500 ? "35vh" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <>
          <motion.div
            style={{
              position: "fixed",
              backgroundColor: "white",
              height: "100vh",
              padding: "1rem",
              overflowY: "scroll",
              width: is500 ? "100vw" : "30rem",
              zIndex: 500,
            }}
            variants={{
              show: { left: 0 },
              hide: { left: -500 },
            }}
            initial={"hide"}
            transition={{ ease: "easeInOut", duration: 3, type: "spring" }}
            animate={isProductFilterOpen === true ? "show" : "hide"}

            // animate={"show"}
          >
            {/* filters section */}
            <Stack
              mb={"5rem"}
              sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}
            >
              <Typography variant="h4">New Arrivals</Typography>
              <IconButton
                onClick={handleFilterClose}
                style={{ position: "absolute", top: 10, right: 35 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <CloseIcon fontSize="medium" />
                </motion.div>
              </IconButton>

              <Stack rowGap={2} mt={4}>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Notes
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Backpacks
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Travel
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Bags
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Hip Hip bags
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Laptop Sleeves
                </Typography>
              </Stack>

              {/* brand filters */}
              <Stack mt={2}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<UnfoldMoreIcon />}
                    aria-controls="brand-filters"
                    id="brand-filter"
                  >
                    <Typography>Brands</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleBrandFilters}>
                      <Grid spacing={2} container>
                        {brands
                          ?.slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((brand) => (
                            <Grid size={{ xs: 6, md: 4 }} key={brand.name}>
                              <motion.div
                                style={{ width: "fit-content" }}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FormControlLabel
                                  sx={{
                                    ml: 1,
                                    // color: pink[800],
                                    "&.Mui-checked": {
                                      color: blue[600],
                                    },
                                  }}
                                  control={
                                    <Checkbox
                                      whileHover={{ scale: 1.05 }}
                                      checked={
                                        filters?.brand &&
                                        filters.brand.some(
                                          (brandValue) =>
                                            brandValue === brand._id
                                        )
                                      }
                                    />
                                  }
                                  label={brand.name}
                                  value={brand._id}
                                />
                              </motion.div>
                            </Grid>
                          ))}
                      </Grid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>

              {/* category filters */}
              <Stack mt={2}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<UnfoldMoreIcon />}
                    aria-controls="category-filters"
                    id="category-filters"
                  >
                    <Typography>Category</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleCategoryFilters}>
                      <Grid spacing={2} container>
                        {categories
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          ?.map((category) => (
                            <Grid size={{ xs: 6, md: 4 }} key={category.name}>
                              <motion.div
                                style={{ width: "fit-content" }}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FormControlLabel
                                  sx={{
                                    ml: 1,
                                    // color: pink[800],
                                    "&.Mui-checked": {
                                      color: blue[600],
                                    },
                                  }}
                                  control={
                                    <Checkbox
                                      whileHover={{ scale: 1.05 }}
                                      checked={
                                        filters?.category &&
                                        filters.category.some(
                                          (catValue) =>
                                            catValue === category._id
                                        )
                                      }
                                    />
                                  }
                                  label={category.name}
                                  value={category._id}
                                />
                              </motion.div>
                            </Grid>
                          ))}
                      </Grid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Stack>
          </motion.div>

          <Stack mb={"3rem"}>
            {/* banners section */}
            {!is600 && (
              <Stack
                sx={{
                  width: "100%",
                  height: is800 ? "300px" : is1200 ? "380px" : "500px",
                }}
              >
                <ProductBanner images={bannerImages} />
              </Stack>
            )}

            {/* product */}
            <Stack rowGap={5} mt={is600 ? 2 : 0}>
              {/* sort options */}
              <Stack
                flexDirection={"row"}
                mr={"2rem"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                columnGap={5}
              >
                <Stack alignSelf={"flex-end"} width={"12rem"}>
                  <FormControl fullWidth>
                    <InputLabel id="sort-dropdown">Sort</InputLabel>

                    {/* make popularity default */}
                    <Select
                      variant="standard"
                      labelId="sort-dropdown"
                      label="Sort"
                      onChange={(e) => {
                        setSort(e.target.value);
                        const selectedOption = sortOptions.filter(
                          (opt) => opt.name === e.target.value
                        )[0];
                        setFilters({
                          ...filters,
                          sort: selectedOption?.sort,
                          order: selectedOption?.order,
                        });
                      }}
                      value={sort}
                    >
                      <MenuItem backgroundColor="text.secondary" value={null}>
                        Reset
                      </MenuItem>
                      {sortOptions.map((option) => (
                        <MenuItem key={`${option.name}`} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              {/* product grid */}
              <Grid
                gap={is700 ? 1 : 2}
                container
                justifyContent={"center"}
                alignItems={"center"}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    thumbnail={product.thumbnail}
                    brand={product.brand.name}
                    price={product.price}
                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                  />
                ))}
              </Grid>

              {/* pagination */}
              <Stack
                alignSelf={is488 ? "center" : "flex-end"}
                mr={is488 ? 0 : 5}
                rowGap={2}
                p={is488 ? 1 : 0}
              >
                <Pagination
                  size={is488 ? "medium" : "large"}
                  page={page}
                  onChange={(e, page) => setPage(page)}
                  count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                  variant="outlined"
                  shape="rounded"
                />
                <Typography>
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {page * ITEMS_PER_PAGE > totalResults
                    ? totalResults
                    : page * ITEMS_PER_PAGE}{" "}
                  OF {totalResults} results
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};

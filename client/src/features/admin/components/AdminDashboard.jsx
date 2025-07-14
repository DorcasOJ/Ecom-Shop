import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategorySlice";
import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  deleteProductByIdAsync,
  fetchProductsAsync,
  resetProductFetchStatus,
  resetProductStatus,
  resetProductUpdateStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProducts,
  selectProductStatus,
  selectProductTotalResults,
  selectProductUpdateState,
  toggleFilters,
  undeleteProductByIdAsync,
} from "../../products/ProductSlice";
import { motion } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { ITEMS_PER_PAGE } from "../../../constants";
import { ProductCard } from "../../products/components/ProductCard";
import { Link } from "react-router-dom";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { selectUserInfo } from "../../user/UserSlice";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";

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

export const AdminDashBoard = () => {
  const [filters, setFilters] = useState({ sort: "", order: "" });
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);

  const productFetchStatus = useSelector(selectProductFetchStatus);

  const productStatus = useSelector(selectProductStatus);
  const productUpdateStatus = useSelector(selectProductUpdateState);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const totalResults = useSelector(selectProductTotalResults);

  const theme = useTheme();
  //   const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  //   const is800 = useMediaQuery(theme.breakpoints.down(800));
  //   const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

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

  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync({ productId, userId: userInfo?._id }));
    setFilters((prev) => ({ ...prev, unDeleted: productId }));
  };

  const handleProductDelete = (productId) => {
    dispatch(deleteProductByIdAsync({ productId, userId: userInfo?._id }));
    setFilters((prev) => ({ ...prev, deleted: productId }));
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
    // console.log("fetching all products");
    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, page]);

  useEffect(() => {
    if (productStatus === "fulfilled") {
      toast.success("Action Successful!");
    } else if (productStatus === "rejected") {
      toast.error("Action failed, please try again later");
    }
  }, [productStatus]);

  useEffect(() => {
    if (productUpdateStatus === "fulfilled") {
      toast.success("Successfully Update Product");
    } else if (productUpdateStatus === "rejected") {
      toast.error("Failed to update product, please try again later");
    }
  }, [productUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductUpdateStatus());
      dispatch(resetProductStatus());
    };
  });

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          backgroundColor: "white",
          overflowY: "scroll",
          height: "100vh",
          width: is500 ? "100vw" : "30rem",
          padding: "1rem",
          zIndex: 500,
        }}
        variants={{ show: { left: 0 }, hide: { left: -500 } }}
        initial={"hide"}
        transition={{ ease: "easeInOut", duration: 0.7, type: "spring" }}
        animate={isProductFilterOpen === true ? "show" : "hide"}
      >
        <Stack
          mb={"5rem"}
          sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}
        >
          <Typography variant="h4">New Arrivals</Typography>
          <IconButton
            style={{ position: "absolute", top: 15, right: 15 }}
            onClick={handleFilterClose}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ClearIcon fontSize="medium" />
            </motion.div>
          </IconButton>

          <Stack rowGap={2} mt={4}>
            <Typography sx={{ cursor: "pointer" }}>Notes</Typography>
            <Typography sx={{ cursor: "pointer" }}>Backpacks</Typography>
            <Typography sx={{ cursor: "pointer" }}>Travel Bags</Typography>
            <Typography sx={{ cursor: "pointer" }}>Hip Bags</Typography>
            <Typography sx={{ cursor: "pointer" }}>Laptop Sleeves</Typography>
          </Stack>

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
                              }}
                              control={
                                <Checkbox
                                  whileHover={{ scale: 1.05 }}
                                  checked={
                                    filters?.brand &&
                                    filters.brand.some(
                                      (brandValue) => brandValue === brand._id
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
                              }}
                              control={
                                <Checkbox
                                  whileHover={{ scale: 1.05 }}
                                  checked={
                                    filters?.category &&
                                    filters.category.some(
                                      (catValue) => catValue === category._id
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

      <Stack mb={"3rem"} rowGap={5} mt={is600 ? 2 : 5}>
        <Stack
          justifyContent={"flex-end"}
          alignItems={"center"}
          columnGap={5}
          flexDirection={"row"}
          mr={"2rem"}
        >
          <Stack alignSelf={"flex-end"} width={"12rem"}>
            {/* sort options */}

            <FormControl fullWidth>
              <InputLabel id="sort-dropdown">Sort</InputLabel>

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

        {productFetchStatus === "pending" ? (
          <Lottie animationData={loadingAnimation} />
        ) : (
          <>
            {/* product grid */}
            <Grid
              gap={5}
              container
              flex={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {products?.map((product) => (
                <Stack key={product?._id}>
                  <Stack sx={{ opacity: product.isDeleted ? 0.5 : 1 }}>
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      title={product.title}
                      thumbnail={product.thumbnail}
                      brand={product.brand.name}
                      price={product.price}
                      isAdminCard={true}
                    />
                  </Stack>
                  <Stack
                    paddingLeft={2}
                    paddingRight={2}
                    flexDirection={"row"}
                    justifySelf={"flex-end"}
                    alignSelf={"flex-end"}
                    columnGap={is488 ? 1 : 2}
                  >
                    <Button
                      component={Link}
                      to={`/admin/product-update/${product._id}`}
                      variant="contained"
                    >
                      Update
                    </Button>
                    {product.isDeleted ? (
                      <Button
                        variant="outlined"
                        onClick={() => handleProductUnDelete(product._id)}
                      >
                        Un-delete
                      </Button>
                    ) : (
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => handleProductDelete(product._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Stack>
                </Stack>
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
          </>
        )}
      </Stack>
    </>
  );
};

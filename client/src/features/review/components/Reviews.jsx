import { useDispatch, useSelector } from "react-redux";
import {
  createReviewAsync,
  resetReviewAddStatus,
  resetReviewDeleteStatus,
  resetReviewUpdateStatus,
  selectReviewAddStatus,
  selectReviewDeleteStatus,
  selectReviewFetchStatus,
  selectReviews,
  selectReviewUpdateStatus,
} from "../ReviewSlice";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import {
  Button,
  LinearProgress,
  Rating,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ReviewItem } from "./ReviewItem";
import { motion, MotionConfig } from "framer-motion";
import { Create } from "@mui/icons-material";

export const Reviews = ({ productId, averageRating }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);

  const [value, setValues] = useState(1);
  const [writeReview, setWriteReview] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const loggedInUser = useSelector(selectLoggedInUser);
  // const reviewStatus = useSelector(selectReviewSta)
  const ref = useRef(null);

  const reviewAddStatus = useSelector(selectReviewAddStatus);
  const reviewDeleteStatus = useSelector(selectReviewDeleteStatus);
  const reviewUpdateStatus = useSelector(selectReviewUpdateStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);

  const theme = useTheme();
  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (reviewAddStatus === "fulfilled") {
      toast.success("Review added");
    } else if (reviewAddStatus === "rejected") {
      toast.error("Error adding review, please try again later");
    }
  }, [reviewAddStatus]);

  useEffect(() => {
    if (reviewDeleteStatus === "fulfilled") {
      toast.success("Review added");
    } else if (reviewDeleteStatus === "rejected") {
      toast.error("Error adding review, please try again later");
    }
  }, [reviewDeleteStatus]);

  useEffect(() => {
    if (reviewUpdateStatus === "fulfilled") {
      toast.success("Review added");
    } else if (reviewUpdateStatus === "rejected") {
      toast.error("Error adding review, please try again later");
    }
  }, [reviewUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetReviewAddStatus());
      dispatch(resetReviewDeleteStatus());
      dispatch(resetReviewUpdateStatus());
    };
  });

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.map((review) => {
    ratingCounts[review.rating] = ratingCounts[review.rating] + 1;
  });

  const handleAddReview = (data) => {
    const review = {
      ...data,
      rating: value,
      user: loggedInUser._id,
      product: productId,
    };
    dispatch(createReviewAsync(review));
    setWriteReview(false);
  };

  return (
    <Stack
      rowGap={5}
      alignSelf={"flex-start"}
      width={is480 ? "90vw" : is840 ? "25rem" : "40rem"}
    >
      <Stack>
        <Typography gutterBottom variant="h4" fontWeight={400}>
          Reviews
        </Typography>
        {reviews?.length ? (
          <Stack rowGap={3}>
            <Stack rowGap={1}>
              <Typography variant="h2" fontWeight={800}>
                {averageRating}.0
              </Typography>
              <Rating readOnly value={averageRating} />
              <Typography variant="h6" color={"text.secondary"}>
                Based on {reviews.length}{" "}
                {reviews.length === 1 ? "Review" : "Reviews"}
              </Typography>
            </Stack>
            <Stack rowGap={2}>
              {[5, 4, 3, 2, 1].map((number) => (
                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  columnGap={1}
                >
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    {" "}
                    {number} star
                  </Typography>
                  <LinearProgress
                    sx={{
                      width: "100%",
                      height: ".8rem",
                      borderRadius: "15px",
                    }}
                    variant="determinate"
                    value={(ratingCounts[number] / reviews?.length) * 100}
                  />
                  <Typography>
                    {parseInt((ratingCounts[number] / reviews?.length) * 100)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Typography variant="h6" color={"text.secondary"} fontWeight={400}>
            {loggedInUser?.isAdmin
              ? "There are no reviews currently"
              : "Be the one to post review first"}
          </Typography>
        )}
      </Stack>

      {/* review mapping */}

      <Stack rowGap={2}>
        {reviews?.map((review) => (
          <ReviewItem
            key={review._id}
            id={review._id}
            userId={review.user._id}
            comment={review.comment}
            createdAt={review.createdAt}
            rating={review.rating}
            username={review.user.name}
          />
        ))}
      </Stack>

      {
        // add review form
        writeReview ? (
          <Stack
            rowGap={3}
            position={"relative"}
            component={"form"}
            noValidate
            onSubmit={handleSubmit(handleAddReview)}
          >
            <TextField
              id="reviewTextField"
              {...register("comment", { required: true })}
              sx={{ mt: 4, width: is840 ? "100%" : "40rem" }}
              multiline
              rows={6}
              fullWidth
              placeholder="Write a review..."
            />

            <Stack>
              <Typography variant="body2" gutterBottom>
                How much did you like the product?
              </Typography>
              <motion.div
                style={{ width: "Fit-content" }}
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 1 }}
              >
                <Rating
                  size="large"
                  value={value}
                  onChange={(e) => setValues(e.target.value)}
                />
              </motion.div>
            </Stack>

            <Stack
              flexDirection={"row"}
              alignSelf={"flex-end"}
              alignItems={"center"}
              columnGap={".2rem"}
            >
              <MotionConfig
                whileTap={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div>
                  <Button
                    sx={{
                      textTransform: "none",
                      fontSize: is480 ? "" : "1rem",
                    }}
                    size={is480 ? "small" : ""}
                    loading={reviewAddStatus === "pending"}
                    type="submit"
                    variant="contained"
                  >
                    Add review
                  </Button>
                </motion.div>
                <motion.div>
                  <Button onClick={() => setWriteReview(false)}>Cancel</Button>
                </motion.div>
              </MotionConfig>
            </Stack>
          </Stack>
        ) : !loggedInUser?.isAdmin ? (
          <motion.div
            onClick={() => setWriteReview(!writeReview)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            style={{ width: "fit-content" }}
          >
            <Button
              disableElevation
              size={is480 ? "medium" : "large"}
              variant="contained"
              sx={{
                color: theme.palette.primary.light,
                textTransform: "none",
                fontSize: "1rem",
                borderRadius: "6px",
              }}
              startIcon={<Create />}
            >
              Write a review
            </Button>
          </motion.div>
        ) : (
          ""
        )
      }
    </Stack>
  );
};

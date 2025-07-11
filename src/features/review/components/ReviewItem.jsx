import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { useForm } from "react-hook-form";
import { useTheme } from "@emotion/react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { deleteReviewsByIdAsync, updateReviewsByIdAsync } from "../ReviewSlice";
import { motion } from "framer-motion";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const ReviewItem = ({
  id,
  username,
  userId,
  comment,
  rating,
  createdAt,
}) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [edit, setEdit] = useState(false);
  const [editRating, setEditRating] = useState(rating);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteReview = () => {
    dispatch(deleteReviewsByIdAsync(id));
    handleClose();
  };

  const handleUpdateReview = (data) => {
    const update = { ...data, _id: id, rating: editRating };
    dispatch(updateReviewsByIdAsync(update));
    setEdit(false);
  };

  const isOwnReview = userId === loggedInUser?._id;

  return (
    <Stack
      position={"relative"}
      p={2}
      rowGap={2}
      width={"100%"}
      component={Paper}
      borderRadius={".8px"}
    >
      {/* user, rating and created at */}
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack flexDirection={"row"} columnGap={2}>
          <Stack>
            <Typography variant="h6" fontSize={"1.1rem"} fontWeight={500}>
              {username}
            </Typography>

            <motion.div>
              <Rating
                size={edit ? (is480 ? "medium" : "large") : "small"}
                readOnly={!edit}
                onChange={(e) => setEditRating(e.target.value)}
                value={edit ? editRating : rating}
              />
            </motion.div>
          </Stack>
        </Stack>

        {isOwnReview && (
          <Stack sx={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  setEdit(true);
                  handleClose();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem onClick={deleteReview}>Delete</MenuItem>
            </Menu>
          </Stack>
        )}

        <Typography
          alignSelf={"flex-end"}
          justifySelf={"flex-end"}
          color={"text.secondary"}
          fontWeight={400}
          fontSize={".9rem"}
        >
          {new Date(createdAt).toDateString()}
        </Typography>
      </Stack>

      {/* review comment */}
      <Stack>
        {edit ? (
          <Stack
            component={"form"}
            noValidate
            onSubmit={handleSubmit(handleUpdateReview)}
            rowGap={2}
          >
            <TextField
              multiline
              rows={4}
              {...register("comment", { required: true, value: comment })}
            />
            <Stack>
              <Button
                fullWidth
                variant="contained"
                size="small"
                type="submit"
                sx={{ alignSelf: "flex-end", mb: "12px" }}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEdit(false)}
                color="error"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Typography color="grayText">{comment}</Typography>
        )}
      </Stack>
    </Stack>
  );
};

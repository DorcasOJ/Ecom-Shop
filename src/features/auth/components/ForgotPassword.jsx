import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  clearForgotPasswordSuccessMessage,
  forgotPasswordAsync,
  resetForgotPasswordStatus,
  selectForgotPasswordError,
  selectForgotPasswordStatus,
  selectForgotPasswordSuccessMessage,
} from "../AuthSlice";
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const status = useSelector(selectForgotPasswordStatus);
  const successMessage = useSelector(selectForgotPasswordSuccessMessage);
  const error = useSelector(selectForgotPasswordError);
  const theme = useTheme();
  const is500 = useMediaQuery(theme.breakpoints.down(500));

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }
    return () => {
      dispatch(clearForgotPasswordSuccessMessage());
    };
  }, [error]);

  useEffect(() => {
    if (status === "fulfilled") {
      toast.error(successMessage?.message);
    }
    return () => {
      dispatch(clearForgotPasswordSuccessMessage());
    };
  }, [status]);

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordStatus());
    };
  }, []);

  const handleForgotPassword = async (data) => {
    dispatch(forgotPasswordAsync(data));
    reset();
  };

  return (
    <Stack
      width={"100%"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack rowGap={"1rem"}>
        <Stack component={Paper} elevation={2}>
          <Stack
            component={"form"}
            width={is500 ? "82vw" : "30rem"}
            p={is500 ? "1rem" : "1.5rem"}
            rowGap={"1rem"}
            noValidate
            onSubmit={handleSubmit(handleForgotPassword)}
          >
            <Stack rowGap={".4rem"}>
              <Typography>
                {status === "fulfilled"
                  ? "Email has been sent!"
                  : "Forgot Your Password?"}
              </Typography>
              <Typography color={"text.secondary"} variant="body2">
                {status === "fulfilled"
                  ? "Please check your inbox and click on the received link to reset your password"
                  : "Enter your registered email below to receive password reset link"}
              </Typography>
            </Stack>
            {status !== "fulfilled" && (
              <>
                <motion.div whileHover={{ y: -2 }}>
                  <TextField
                    fullWidth
                    sx={{ mt: 1 }}
                    id="outlined-basic"
                    label="Email"
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: {
                        value:
                          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </motion.div>

                <motion.div>
                  <Button
                    sx={{ height: "2.5rem" }}
                    fullWidth
                    loading={status === "pending"}
                    type="submit"
                    variant="contained"
                  >
                    Send Password Reset Link
                  </Button>
                </motion.div>
              </>
            )}
          </Stack>
        </Stack>

        <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.05 }}>
          <Typography
            mt={3}
            component={Link}
            to={"/login"}
            variant="body2"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              width: "fit-content",
            }}
          >
            Go back to{" "}
            <span style={{ color: theme.palette.primary.dark }}>login</span>
          </Typography>
        </motion.div>
      </Stack>
    </Stack>
  );
};

import { useDispatch, useSelector } from "react-redux";
import {
  clearSignupError,
  resetSignupStatus,
  selectLoggedInUser,
  selectSignupError,
  selectSignupStatus,
  signupAsync,
} from "../AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTheme } from "@emotion/react";
import {
  FormHelperText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { ecommerceOutlookAnimation } from "../../../assets";
import { MotionConfig, motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const dispatch = useDispatch();
  const status = useSelector(selectSignupStatus);
  const error = useSelector(selectSignupError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleClickShowPassword = () =>
    setShowPassword((prev) => ({ ...prev, password: !showPassword.password }));
  const handleClickShowConfirmPassword = () =>
    setShowPassword((prev) => ({
      ...prev,
      confirmPassword: !showPassword.confirmPassword,
    }));

  const onSubmit = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(signupAsync(cred));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (loggedInUser && !loggedInUser.isVerified) {
      navigate("/verify-otp");
    } else if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (status === "fulfilled") {
      toast.success(
        "Welcome! Verify your email to start shopping on mern-ecommerce"
      );
      reset();
    }
    return () => {
      dispatch(clearSignupError());
      dispatch(resetSignupStatus());
    };
  });

  return (
    <Stack
      width={"100%"}
      height={"100vh"}
      flexDirection={"row"}
      sx={{ overflowY: "hidden" }}
    >
      {!is900 && (
        <Stack bgcolor={"black"} flex={1} justifyContent={"center"}>
          <Lottie animationData={ecommerceOutlookAnimation} />
        </Stack>
      )}

      <Stack flex={1} justifyContent={"center"} alignItems={"center"}>
        <Stack
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Stack rowGap={".4rem"}>
            <Typography
              variant="h2"
              sx={{ wordBreak: "break-word" }}
              fontWeight={600}
            >
              Ecom Shop
            </Typography>

            <Typography
              alignSelf={"flex-end"}
              color={"GreyText"}
              variant="body2"
            >
              - Shop Anything
            </Typography>
          </Stack>
        </Stack>

        <Stack
          mt={4}
          spacing={2}
          width={is480 ? "95vw" : "28rem"}
          component={"form"}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* motion */}
          <MotionConfig whileHover={{ y: -5 }}>
            <motion.div>
              <TextField
                fullWidth
                {...register("name", { required: "Username is required" })}
                id="outlined-basic-username"
                label="Username"
                variant="outlined"
                autoComplete="username"
              />
              {errors.name && <FormHelperText error></FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField
                fullWidth
                id="outlined-basic-email"
                autoComplete="email"
                label="Email"
                variant="outlined"
                {...register("email", {
                  register: "Email is required",
                  pattern: {
                    value:
                      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                    message: "Enter a valid email",
                  },
                })}
              />

              {errors.email && (
                <FormHelperText error>{errors.email.message}</FormHelperText>
              )}
            </motion.div>

            <motion.div>
              <TextField
                type={showPassword?.password ? "text" : "password"}
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters
                    `,
                  },
                })}
                id="outlined-password-input"
                label="Password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onTouchStart={handleClickShowPassword}
                        edge="end"
                        aria-label="toggle-password visibility"
                      >
                        {showPassword?.password ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {errors.password && (
                <FormHelperText error>{errors.password.message}</FormHelperText>
              )}
            </motion.div>

            <motion.div>
              <TextField
                type={showPassword?.confirmPassword ? "text" : "password"}
                fullWidth
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value, formValues) =>
                    value === formValues.password || "passwords doesn't match",
                })}
                label="Confirm Password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        onTouchStart={handleClickShowConfirmPassword}
                        edge="end"
                        aria-label="toggle-confirm-password visibility"
                      >
                        {showPassword?.confirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.confirmPassword && (
                <FormHelperText error>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </motion.div>
          </MotionConfig>

          <motion.div>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: "2.5rem" }}
              type="submit"
              loading={status === "pending"}
            >
              Signup
            </Button>
          </motion.div>

          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"wrap-reverse"}
          >
            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.05 }}>
              <motion.div>
                <Typography
                  mr={"1.5rem"}
                  sx={{
                    textDecoration: "none",
                    color: "text.primary",
                    cursor: "pointer",
                  }}
                  to={"/forgot-password"}
                  component={Link}
                >
                  Forgot Password
                </Typography>
              </motion.div>

              <motion.div>
                <Typography
                  sx={{ textDecoration: "none", color: "text-primary" }}
                  to={"/login"}
                  component={Link}
                >
                  Already a member?{" "}
                  <span
                    style={{
                      color: theme.palette.primary.dark,
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </span>
                </Typography>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

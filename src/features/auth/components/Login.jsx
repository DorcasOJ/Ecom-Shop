import { useDispatch, useSelector } from "react-redux";
import {
  clearLoginError,
  loginAsync,
  resetLoginStatus,
  selectLoggedInUser,
  selectLoginError,
  selectLoginStatus,
} from "../AuthSlice";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import {
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { ecommerceOutlookAnimation } from "../../../assets";
import { MotionConfig, motion, scale } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);
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

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  // handle redirection
  useEffect(() => {
    if (loggedInUser && loggedInUser?.isVerified) {
      navigate("/");
    } else if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    }
  }, [loggedInUser]);

  // handle login error and toast them

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  });

  // handles login status
  useEffect(() => {
    if (status === "fulfilled" && loggedInUser?.isVerified === true) {
      toast.success("Login successful");
      reset();
    }
    return () => {
      dispatch(clearLoginError());
      // dispatch(resetLoginStatus());
    };
  }, [status]);

  const onSubmit = (data) => {
    const cred = { ...data };
    dispatch(loginAsync(cred));
  };

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
              -Shop Anything
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
          <motion.div whileHover={{ y: -5 }}>
            <TextField
              key={"login-email"}
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  message: "Enter a valid email",
                },
              })}
              //   variant="outlined"
              id="outlined-basic"
              label="Email"
              autoComplete="email"
              defaultValue="dcas@test2.com"
            />
            {errors.email && (
              <FormHelperText sx={{ mt: 1 }} error>
                {errors.email.message}
              </FormHelperText>
            )}
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <TextField
              key={"login-password"}
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password", { required: "Password is required" })}
              id="outlined-password-input"
              label="Password"
              defaultValue="Password1"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      onTouchStart={handleTogglePassword}
                      edge="end"
                      aria-label="toggle login password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && (
              <FormHelperText sx={{ mt: 1 }} error>
                {errors.password.message}
              </FormHelperText>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <Button
              fullWidth
              loading={status === "pending"}
              type="submit"
              variant="contained"
              sx={{
                height: "2.5rem",
                // backgroundColor:
                //   status === "pending"
                //     ? theme.palette.primary.loading
                //     : theme.palette.primary.main,
              }}
            >
              Login
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
                  component={Link}
                  to={"/forgot-password"}
                >
                  Forgot password
                </Typography>
              </motion.div>

              <motion.div>
                <Typography
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to={"/signup"}
                  component={Link}
                >
                  Don't have an account?{" "}
                  <span
                    style={{
                      color: theme.palette.primary.dark,
                      cursor: "pointer",
                    }}
                  >
                    Register
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

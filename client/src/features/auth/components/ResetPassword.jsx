import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  clearResetPasswordError,
  clearResetPasswordSuccessMessage,
  resetPasswordAsync,
  resetResetPasswordStatus,
  selectResetPasswordError,
  selectResetPasswordStatus,
  selectResetPasswordSuccessMessage,
} from "../AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import {
  Button,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { MotionConfig, motion } from "framer-motion";

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(selectResetPasswordStatus);
  const error = useSelector(selectResetPasswordError);
  const successMessage = useSelector(selectResetPasswordSuccessMessage);
  const { userId, passwordResetToken } = useParams();
  const theme = useTheme();
  const is500 = useMediaQuery(theme.breakpoints.down(500));

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      dispatch(clearResetPasswordError());
    };
  });

  useEffect(() => {
    if (status === "fulfilled") {
      toast.success(successMessage?.message);
    }
    return () => {
      dispatch(clearResetPasswordSuccessMessage());
    };
  });

  useEffect(() => {
    return () => {
      dispatch(resetResetPasswordStatus());
    };
  });

  const handleResetPassword = async (data) => {
    const cred = { ...data, userId: userId, token: passwordResetToken };
    delete cred.confirmPassword;
    dispatch(resetPasswordAsync(cred));
    reset();
  };

  return (
    <Stack
      width={"100%"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack component={Paper} elevation={2}>
        <Stack
          component={"form"}
          width={is500 ? "82vw" : "30rem"}
          p={"1rem"}
          rowGap={"1rem"}
          noValidate
          onSubmit={handleSubmit(handleResetPassword)}
        >
          <Stack rowGap={".3rem"}>
            <Typography variant="h4" fontWeight={600}>
              Reset Password
            </Typography>
            <Typography color={"GrayText"}>
              Please enter and confirm new password
            </Typography>
          </Stack>

          <Stack rowGap={".5rem"}>
            <MotionConfig whileHover={{ y: -2 }}>
              <motion.div>
                <TextField
                  fullWidth
                  type="password"
                  {...register("password", {
                    required: "Please enter a password",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message:
                        "at least 8 characters, must contain at least 1 lowercase letter, and 1 number, can contain special characters",
                    },
                  })}
                  label="Password"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </motion.div>

              <motion.div>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  autoComplete="current-password"
                  type="password"
                  sx={{ mt: 1 }}
                  {...register("confirmPassword", {
                    required: "Please Confirm the password",
                    validate: (value, formValues) =>
                      value === formValues.password,
                  })}
                  id="outlined-password-input"
                />
                {errors.confirmPassword && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {errors.confirmPassword.message}
                  </FormHelperText>
                )}
              </motion.div>
            </MotionConfig>
          </Stack>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <Button
              fullWidth
              sx={{ height: "2.8rem" }}
              loading={resetResetPasswordStatus === "pending"}
              type="submit"
              variant="contained"
            >
              Reset Password
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </Stack>
  );
};

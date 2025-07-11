import { useTheme } from "@emotion/react";
import {
  Button,
  FormControl,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
// import {PaystackButton} from ""

export const PaymentPage = () => {
  const publicKey = "pk_test_cb9d53555dd376ab099a20bb01b6cd32dd0b06a0";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const onSubmit = () => {};
  return (
    <Stack
      width={"100%"}
      height={"100vh"}
      flexDirection={"row"}
      sx={{ overflowY: "hidden" }}
    >
      <Stack
        mt={4}
        spacing={2}
        width={is480 ? "95vw" : "28rem"}
        component={"form"}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <>
          <motion.div whileHover={{ y: -5 }}>
            <TextField
              label="Email"
              {...register("email", { required: "Email is required" })}
              autoComplete="email"
              placeholder="Email"
            />
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <TextField
              label="Email"
              {...register("email", { required: "Email is required" })}
              autoComplete="email"
              placeholder="Email"
            />
          </motion.div>
          <Button type="submit">Pay</Button>
        </>
      </Stack>
    </Stack>
  );
};

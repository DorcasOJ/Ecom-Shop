import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Input,
} from "@mui/material";
import {
  appStorePng,
  facebookPng,
  googlePlayPng,
  instagramPng,
  linkedinPng,
  QRCodePng,
  twitterPng,
} from "../../assets";
import { MotionConfig, motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

export const Footer = () => {
  const theme = useTheme();
  const is700 = useMediaQuery(theme.breakpoints.down(700));

  const labelStyles = {
    fontWeight: 300,
    cursor: "pointer",
  };

  return (
    <Stack mt={10}>
      {/* upper */}
      <Stack
        flexDirection={"row"}
        rowGap={"1rem"}
        justifyContent={is700 ? "" : "space-around"}
        flexWrap={"wrap"}
      >
        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6" fontSize={"1.5rem"}>
            Exclusive
          </Typography>

          <Typography variant="h6">Subscribe</Typography>

          <Typography sx={labelStyles}>Get 10% off your first order</Typography>

          {/* <Input
            placeholder="email"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          /> */}

          {/* <TextField
            label="Enter your email"
            sx={{ border: "1px solid white", borderRadius: "6px" }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          /> */}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Enter your email"
              sx={{ border: "1px solid white", borderRadius: "6px" }}
            />
            <IconButton>
              <SendIcon />
            </IconButton>
          </Box>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Support</Typography>
          <Typography sx={labelStyles}>
            11th Main Street, Donka, UH 1010, Lagos.
          </Typography>
          <Typography sx={labelStyles}>exclusive@email.com</Typography>
          <Typography sx={labelStyles}>+234-000-9004-7000</Typography>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Account</Typography>

          <Typography sx={labelStyles}>My Account</Typography>

          <Typography sx={labelStyles}>Login / Register</Typography>

          <Typography sx={labelStyles}>Cart</Typography>

          <Typography sx={labelStyles}>Wishlist</Typography>

          <Typography sx={labelStyles}>Shop</Typography>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Quick Links</Typography>

          <Typography sx={labelStyles}>Privacy Policy</Typography>

          <Typography sx={labelStyles}>Terms of Use</Typography>

          <Typography sx={labelStyles}>FAQ</Typography>

          <Typography sx={labelStyles}>Contact</Typography>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Download App</Typography>

          <Typography
            sx={{ ...labelStyles, color: "graytext", fontWeight: 500 }}
          >
            Save $3 with App New User Only
          </Typography>
          <Stack flexDirection={"row"} columnGap={".5rem"}>
            <Box width={"100px"} height={"100px"}>
              <img
                src={QRCodePng}
                height={"100px"}
                weight={"100px"}
                alt="QR Code"
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Stack justifyContent={"space-around"}>
              <Stack>
                <img
                  src={googlePlayPng}
                  alt="GooglePlay"
                  style={{ height: "100%", width: "100%", cursor: "pointer" }}
                />
              </Stack>

              <Stack>
                <img
                  src={appStorePng}
                  alt="AppStore"
                  style={{ height: "100%", width: "100%", cursor: "pointer" }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack rowGap={2}>
          <MotionConfig whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
            <motion.div style={{ cursor: "pointer" }}>
              <IconButton>
                <Facebook />
              </IconButton>
            </motion.div>

            <motion.div style={{ cursor: "pointer" }}>
              <IconButton>
                <Twitter />
              </IconButton>
            </motion.div>

            <motion.div style={{ cursor: "pointer" }}>
              <IconButton>
                <Instagram />
              </IconButton>
            </motion.div>

            <motion.div style={{ cursor: "pointer" }}>
              <IconButton>
                <LinkedIn />
              </IconButton>
            </motion.div>
          </MotionConfig>
        </Stack>
      </Stack>

      {/* lower */}
      <Stack alignSelf={"center"}>
        <Typography color={"GrayText"}>
          &copy; Ecom Store {new Date().getFullYear()}. All right reserved
        </Typography>
      </Stack>
    </Stack>
  );
};

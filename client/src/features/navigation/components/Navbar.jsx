import React from "react";
import { selectUserInfo } from "../../user/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuIcon from "@mui/icons-material/Menu";
import { selectCartItems } from "../../cart/CartSlice";
import { selectWishlists } from "../../wishlist/WishlistSlice";
import {
  selectProductIsFilterOpen,
  toggleFilters,
} from "../../products/ProductSlice";
import {
  FavoriteBorder,
  ShoppingCartOutlined,
  Tune,
} from "@mui/icons-material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export const NavBar = ({ isProductList = false }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishListItems = useSelector(selectWishlists);
  const isProductFIlterOpen = useSelector(selectProductIsFilterOpen);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFIlters = () => {
    dispatch(toggleFilters());
  };

  const pages = [
    { name: "Home", to: "/" },
    {
      name: "Profile",
      to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile",
    },
    {
      name: loggedInUser?.isAdmin ? "Orders" : "My orders",
      to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders",
    },
    { name: "Logout", to: "/logout" },
  ];

  const settings = [
    { name: "Profile", to: "/" },
    { name: "Logout", to: "/logout" },
  ];
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <StorefrontIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            // href="#app-bar-with-responsive-menu"
            to={"/"}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Logo
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      textDecoration: "none",
                      color: "text.primary",
                      cursor: "pointer",
                    }}
                    component={Link}
                    to={`${page.to}`}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <StorefrontIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            // href="#app-bar-with-responsive-menu"
            to={"/"}
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 2,
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              ml: "2rem",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                color="inherit"
                component={Link}
                to={`${page.to}`}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userInfo?.name} sx={{ ml: "4px" }} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {loggedInUser?.isAdmin && (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography
                    component={Link}
                    sx={{ textDecoration: "none" }}
                    to={"/admin/add-product"}
                    textAlign={"center"}
                    color="text.primary"
                  >
                    Add new Product
                  </Typography>
                </MenuItem>
              )}

              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      textDecoration: "none",
                      color: "text.primary",
                      cursor: "pointer",
                    }}
                    component={Link}
                    to={`${setting.to}`}
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ ml: "1rem" }}>
            <Typography variant="h6" fontWeight={300}>
              {is480
                ? `${userInfo?.name.toString().split(" ")[0]} `
                : `Hey👋, ${userInfo?.name || "user"}`}
            </Typography>
            {/* {loggedInUser.isAdmin && <Button variant="contained">Admin</Button>} */}
          </Box>

          <Box>
            <Stack
              sx={{
                flexDirection: "row",
                columnGap: "1rem",
                alignItems: "center",
                justifyContent: "center",
                ml: "1rem",
              }}
            >
              {cartItems?.length > 0 && (
                <Badge badgeContent={cartItems.length} color="error">
                  <IconButton onClick={() => navigate("/cart")}>
                    <ShoppingCartOutlined />
                  </IconButton>
                </Badge>
              )}

              {!loggedInUser?.isAdmin && (
                <Stack>
                  <Badge badgeContent={wishListItems?.length} color="error">
                    <IconButton component={Link} to={"/wishlist"}>
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Badge>
                </Stack>
              )}

              {isProductList && (
                <IconButton onClick={handleToggleFIlters}>
                  <Tune
                    sx={{ color: isProductFIlterOpen ? "gray" : "black" }}
                  />
                </IconButton>
              )}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

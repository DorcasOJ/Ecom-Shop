import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../../features/auth/AuthSlice";
import { useEffect } from "react";
import { fetchLoggedInUserByIdAsync } from "../../features/user/UserSlice";
import { fetchAllCategoriesAsync } from "../../features/categories/CategorySlice";
import { fetchAllBrandsAsync } from "../../features/brands/BrandSlice";
import {
  getCartByUserIdAsync,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../features/cart/CartSlice";
import {
  fetchAddressByUserIdAsync,
  selectAddresses,
} from "../../features/address/AddressSlice";
import { fetchWishlistByUserIdAsync } from "../../features/wishlist/WishlistSlice";

export const useFetchLoggedInUserDetails = (user) => {
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    /* when a user is logged in then this dispatches an action to get all the details of loggedInUser, 
        as while login and signup only the bare-minimum information is sent by the server */
    if (user && loggedInUser?.isVerified) {
      dispatch(fetchLoggedInUserByIdAsync(loggedInUser?._id));
      dispatch(fetchAllBrandsAsync());
      dispatch(fetchAllCategoriesAsync());

      if (!loggedInUser.isAdmin) {
        dispatch(getCartByUserIdAsync(loggedInUser?._id));

        dispatch(fetchAddressByUserIdAsync(loggedInUser?._id));

        dispatch(fetchWishlistByUserIdAsync({ id: loggedInUser?._id }));
        // console.log("useFetchLoggedInUser3333 going...", wish);
      }
    }
  }, [user]);
};

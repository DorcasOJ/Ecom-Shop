import { useSelector } from "react-redux";
import { SignupPage } from "./pages/SignupPage";
import {
  selectIsAuthChecked,
  selectLoggedInUser,
} from "./features/auth/AuthSlice";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import { Protected } from "./features/auth/components/Protected";
import { Logout } from "./features/auth/components/Logout";

import {
  LoginPage,
  OtpVerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  HomePage,
  ProductDetailsPage,
  CartPage,
  WishlistPage,
  CheckoutPage,
  OrderSuccessPage,
  PaymentPage,
  UserOrderPage,
  UserProfilePage,
  NotFoundPage,
  AddProductPage,
  AdminDashboardPage,
  ProductUpdatePage,
} from "./pages";

function App() {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/reset-password/:userId/:passwordResetToken"
          element={<ResetPasswordPage />}
        />

        <Route
          exact
          path="/logout"
          element={
            <Protected>
              <Logout />
            </Protected>
          }
        />

        <Route
          exact
          path="/product-details/:id"
          element={
            <Protected>
              <ProductDetailsPage />
            </Protected>
          }
        />

        {loggedInUser?.isAdmin ? (
          // admin routes
          <>
            <Route
              path="/admin/add-product"
              element={
                <Protected>
                  <AddProductPage />
                </Protected>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <Protected>
                  <AdminDashboardPage />
                </Protected>
              }
            />

            <Route
              path="/admin/product-update/:id"
              element={
                <Protected>
                  <ProductUpdatePage />
                </Protected>
              }
            />
            <Route
              path="*"
              element={
                <Protected>
                  <AdminDashboardPage />
                </Protected>
              }
            />
          </>
        ) : (
          <>
            {/* user routes */}
            <Route
              path="/"
              element={
                <Protected>
                  <HomePage />
                </Protected>
              }
            />
            <Route
              path="/cart"
              element={
                <Protected>
                  <CartPage />
                </Protected>
              }
            />

            <Route
              path="/wishlist"
              element={
                <Protected>
                  <WishlistPage />
                </Protected>
              }
            />
            <Route
              path="/checkout"
              element={
                <Protected>
                  <CheckoutPage />
                </Protected>
              }
            />

            <Route
              path="/payment"
              element={
                <Protected>
                  <PaymentPage />
                </Protected>
              }
            />
            <Route
              path="/order-success/:id"
              element={
                <Protected>
                  <OrderSuccessPage />
                </Protected>
              }
            />
            <Route
              path="/orders"
              element={
                <Protected>
                  <UserOrderPage />
                </Protected>
              }
            />
            <Route
              path="/profile"
              element={
                <Protected>
                  <UserProfilePage />
                </Protected>
              }
            />
          </>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );
  return <RouterProvider router={routes} />;
}

export default App;

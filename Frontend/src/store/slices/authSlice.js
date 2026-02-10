import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import API from "../../api/api"

const token = localStorage.getItem("token")
const user = JSON.parse(localStorage.getItem("user") || "null")

export const login = createAsyncThunk(
  "auth/login",
  async ({ emailOrPhone, password }) => {
    const res = await API.post("/api/auth/login", { emailOrPhone, password });

    if (res.data.isDummy) {
      localStorage.setItem("isDummy", "true");
      localStorage.setItem("dummyOtp", res.data.dummyOtp);
      localStorage.setItem("pendingEmail", emailOrPhone);

      return {
        otpRequired: true,
        isDummy: true,
        dummyOtp: res.data.dummyOtp
      };
    }
    if (res.data.otpRequired) {
      localStorage.setItem("pendingEmail", emailOrPhone);
      return { otpRequired: true };
    }
    return res.data;
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ emailOrPhone, otp }) => {
    const isDummy = localStorage.getItem("isDummy") === "true";
    const dummyOtp = localStorage.getItem("dummyOtp");

    if (isDummy) {
      if (otp !== dummyOtp) {
        throw new Error("Invalid dummy OTP");
      }

      const finalUser = { email: emailOrPhone, role: "user", demo: true };

      localStorage.setItem("token", "DUMMY_TOKEN");
      localStorage.setItem("user", JSON.stringify(finalUser));
      localStorage.setItem("role", "user");
      localStorage.removeItem("dummyOtp");

      API.defaults.headers.common["Authorization"] = "Bearer DUMMY_TOKEN";

      return { success: true, user: finalUser, token: "DUMMY_TOKEN" };
    }

    const res = await API.post("/api/auth/verify-otp", { emailOrPhone, otp });

    if (!res.data.success) {
      throw new Error(res.data.message);
    }

    const { token, role } = res.data;
    const finalUser = { email: emailOrPhone, role };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("role", role);

    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { success: true, user: finalUser, token };
  }
);


export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ emailOrPhone  }) => {
    const res = await API.post("/api/auth/resend-otp", { emailOrPhone })
    return res.data
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    token,
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("isDummy");
      localStorage.removeItem("dummyOtp");

      delete API.defaults.headers.common["Authorization"];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.token) {
          const { token, role } = action.payload;
          const finalUser = { role };

          state.user = finalUser;
          state.token = token;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(finalUser));
          localStorage.setItem("role", role);

          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(verifyOtp.pending, (state) => { state.loading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(resendOtp.pending, (state) => { state.loading = true; })
      .addCase(resendOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import activate from "./slices/activateSlice";
export const store = configureStore({
	reducer: {
		auth,
		activate,
	},
});

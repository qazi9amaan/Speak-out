import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	name: "",
	avatar:
		"https://www.kindpng.com/picc/m/268-2689663_cute-monkey-stickers-messages-sticker-0-cute-stickers.png",
	username: "",
};

export const activateSlice = createSlice({
	name: "activate",
	initialState,
	reducers: {
		setName: (state, action) => {
			state.name = action.payload;
		},
		setUserName: (state, action) => {
			state.username = action.payload;
		},
		setAvatar: (state, action) => {
			state.avatar = action.payload;
		},
	},
});

export const { setName, setAvatar, setUserName } =
	activateSlice.actions;

export default activateSlice.reducer;

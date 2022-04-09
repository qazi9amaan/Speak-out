import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";

export function useLoadingWithRefresh() {
	const [loading, setLoading] = React.useState(true);
	const dispatch = useDispatch();

	React.useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/auth/refresh`,
					{
						withCredentials: true,
					}
				);
				dispatch(setAuth(data));
				setLoading(false);
			} catch (error) {
				console.log(error.message);
				setLoading(false);
			}
		})();
	}, []);

	return { loading };
}

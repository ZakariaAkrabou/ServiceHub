
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRefreshTokenMutation } from "../api/AuthApi";
import { setCredentials, logout } from "./AuthSlice";

export function useAuthBootstrap(onDone?: () => void) {
    const dispatch = useDispatch();
    const [refreshToken] = useRefreshTokenMutation();

    useEffect(() => {
        (async () => {
            try {
                // 1. Refresh access token
                const result = await refreshToken({}).unwrap();
                if (result?.accessToken) {
                    // 2. Fetch user profile with new token
                    const profileRes = await fetch("http://localhost:5000/api/user/profile", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${result.accessToken}`,
                        },
                        credentials: "include",
                    });
                    if (!profileRes.ok) throw new Error("Profile fetch failed");
                    const profileData = await profileRes.json();
                    // 3. Set both token and user in Redux
                    dispatch(setCredentials({ token: result.accessToken, user: profileData.user }));
                } else {
                    dispatch(logout());
                }
            } catch {
                dispatch(logout());
            } finally {
                if (onDone) onDone();
            }
        })();
    }, [dispatch, refreshToken, onDone]);
}

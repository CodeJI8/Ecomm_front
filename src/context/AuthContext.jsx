import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, login as loginRequest, logout as logoutRequest, register as registerRequest, tokenStorage } from "../api";
import { AuthContext } from "./authContext";
import { getApiData } from "../utils/getApiData";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => tokenStorage.get());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStorage.get()));
  const [profileError, setProfileError] = useState(null);
  const profileController = useRef(null);

  const clearSession = useCallback((redirect = true) => {
    logoutRequest();
    setToken(null);
    setUser(null);
    setLoading(false);
    setProfileError(null);
    if (redirect) navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const onLogout = () => {
      setToken(null);
      setUser(null);
      setLoading(false);
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:logout", onLogout);
    return () => {
      window.removeEventListener("auth:logout", onLogout);
      profileController.current?.abort();
    };
  }, [navigate]);

  const loadProfile = useCallback(async (signal) => {
    try {
      const profile = getApiData(await getProfile({ signal }));
      if (signal?.aborted) return;
      if (!profile) throw new Error("The profile response was empty.");
      setUser(profile?.user ?? profile?.profile ?? profile);
      setProfileError(null);
    } catch (error) {
      if (signal?.aborted) return;
      if (error?.status === 401) clearSession(false);
      if (error?.code !== "ERR_CANCELED") setProfileError(error);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) loadProfile(controller.signal);
    });
    return () => controller.abort();
  }, [token, loadProfile]);

  const login = useCallback(async (credentials) => {
    const result = getApiData(await loginRequest(credentials));
    if (result?.token && tokenStorage.get() !== result.token) tokenStorage.set(result.token);
    const nextToken = result?.token ?? tokenStorage.get();
    setLoading(Boolean(nextToken));
    setProfileError(null);
    setToken(nextToken);
    setUser(result?.user ?? result?.profile ?? null);
    return result;
  }, []);

  const register = useCallback(async (details) => registerRequest(details), []);

  const refreshProfile = useCallback(() => {
    profileController.current?.abort();
    profileController.current = new AbortController();
    return loadProfile(profileController.current.signal);
  }, [loadProfile]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(() => ({
    user, token, loading, profileError, login, logout, register, refreshProfile,
  }), [user, token, loading, profileError, login, logout, register, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

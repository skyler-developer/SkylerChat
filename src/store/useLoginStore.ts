import { create } from "zustand";

interface LoginStore {
    isLogin: boolean;
    setLogin: (isLogin: boolean) => void;
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    loginError: string;
    setLoginError: (error: string) => void;
    loginSuccess: string;
    setLoginSuccess: (success: string) => void;
    loginLoading: boolean;
    setLoginLoading: (loading: boolean) => void;
    loginModalVisible: boolean;
    setLoginModalVisible: (visible: boolean) => void;

    // true为登录，false为注册
    loginOption: boolean;
    setLoginOption: (option: boolean) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
    isLogin: false,
    setLogin: (isLogin) => set({ isLogin }),
    username: "",
    setUsername: (username) => set({ username }),
    password: "",
    setPassword: (password) => set({ password }),
    loginError: "",
    setLoginError: (error) => set({ loginError: error }),
    loginSuccess: "",
    setLoginSuccess: (success) => set({ loginSuccess: success }),
    loginLoading: false,
    setLoginLoading: (loading) => set({ loginLoading: loading }),
    loginModalVisible: false,
    setLoginModalVisible: (visible) => set({ loginModalVisible: visible }),
    loginOption: true, // true为登录，false为注册
    setLoginOption: (option) => set({ loginOption: option }),
}));

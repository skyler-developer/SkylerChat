import { create } from "zustand";

interface LoginStore {
    isLogin: boolean;
    setLogin: (isLogin: boolean) => void;
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    newPassword: string;
    setNewPassword: (newPassword: string) => void;
    uuid: string;
    setUuid: (uuid: string) => void;
    loginLoading: boolean;
    setLoginLoading: (loading: boolean) => void;
    loginModalVisible: boolean;
    setLoginModalVisible: (visible: boolean) => void;

    // true为登录，false为注册，null为修改密码
    loginOption: boolean | null;
    setLoginOption: (option: boolean | null) => void;
}

export const useUserInfoStore = create<LoginStore>((set) => ({
    isLogin: false,
    setLogin: (isLogin) => set({ isLogin }),
    username: "",
    setUsername: (username) => set({ username }),
    password: "",
    setPassword: (password) => set({ password }),
    newPassword: "",
    setNewPassword: (newPassword) => set({ newPassword }),
    uuid: "",
    setUuid: (uuid) => set({ uuid }),
    loginError: "",
    loginLoading: false,
    setLoginLoading: (loading) => set({ loginLoading: loading }),
    loginModalVisible: false,
    setLoginModalVisible: (visible) => set({ loginModalVisible: visible }),
    loginOption: true, // true为登录，false为注册
    setLoginOption: (option) => set({ loginOption: option }),
}));

declare global {
    interface UserCredentials {
        username: string;
        password: string;
    }

    interface AuthUser {
        username: string;
        token: string;
        role: "SERVANT" | "STUDENT" | "SUPER_SERVANT";
    }

}

export { }; 
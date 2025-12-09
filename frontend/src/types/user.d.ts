declare global {
    interface UserCredentials {
        username: string;
        password: string;
    }

    interface UserTokenAndRole {
        token: string;
        role: "SERVANT" | "STUDENT";
    }


}

export { }; 
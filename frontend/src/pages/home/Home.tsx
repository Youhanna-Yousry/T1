import { useEffect } from "react";
import test from "services/servant"
import useAxiosInterceptor from "hooks/useAxiosInterceptor";

export default function Home() {
    useAxiosInterceptor();

    useEffect(() => {
        test()
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }, []);

    return <div>Home Component</div>;
}
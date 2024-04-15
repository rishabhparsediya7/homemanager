import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: any) {
    return function Auth(props: any) {
        useEffect(() => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (!token || !user || !isLoggedIn) {
                redirect('/')
            }
        }, []);
        return <Component {...props} />;
    }
}

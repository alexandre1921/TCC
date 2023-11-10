import { FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { auth } from '../utils/firebase';

export type WithAuthProps = {
    user: User | null | undefined;
};

export const withAuth = (Component: FC<WithAuthProps>) =>
    function WithAuthHOC() {
        const [user, loading, error] = useAuthState(auth, {});

        // TODO - build a loader
        if (loading) return <div>Loading...</div>;

        return <Component user={user} />;
    };

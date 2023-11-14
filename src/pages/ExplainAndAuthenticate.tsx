import { Navigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import { Spinner } from 'flowbite-react';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { WithAuthProps, withAuth } from '../HOCs/withAuth';
import { ActionMessage } from '../components/ActionMessage';
import { auth, firestore } from '../utils/firebase';

export function ExplainAndAuthenticateBase({ user }: WithAuthProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (user) return <Navigate to="/game" />;

    const loginAction = [
        {
            id: 'login',
            children: isLoading ? <Spinner /> : 'Jogar',
            onClick: async () => {
                setIsLoading(true);

                try {
                    const {
                        user: { uid },
                    } = await signInAnonymously(auth);

                    await setDoc(doc(firestore, 'users', uid), {
                        acceptedTerms: true,
                        createdAt: Timestamp.now(),
                    });
                } catch (error) {
                    // TODO - handle error
                    // eslint-disable-next-line no-console
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            },
        },
    ];

    return (
        <div className="h-full">
            <ActionMessage height="full" actions={loginAction}>
                Bem vindo, ao clicar em jogar você aceita que seus dados sejam usados para a pesquisa.
            </ActionMessage>
        </div>
    );
}

export const ExplainAndAuthenticate = withAuth(ExplainAndAuthenticateBase);

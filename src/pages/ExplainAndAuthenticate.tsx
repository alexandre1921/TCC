import { Navigate } from 'react-router-dom';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { WithAuthProps, withAuth } from '../HOCs/withAuth';
import { ActionMessage } from '../components/ActionMessage';

const auth = getAuth();

const loginAction = [
    {
        id: 'login',
        children: 'Jogar',
        onClick: () => signInAnonymously(auth),
    },
];

export function ExplainAndAuthenticateBase({ user }: WithAuthProps) {
    if (user) return <Navigate to="/game" />;

    return (
        <div className="h-full">
            <ActionMessage height="full" actions={loginAction}>
                Bem vindo, ao clicar em jogar você aceita que seus dados sejam usados para a pesquisa.
            </ActionMessage>
        </div>
    );
}

export const ExplainAndAuthenticate = withAuth(ExplainAndAuthenticateBase);

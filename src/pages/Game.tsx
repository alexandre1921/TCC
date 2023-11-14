import { Navigate } from 'react-router-dom';
import { ActionMessage } from '../components/ActionMessage';
import { WithAuthProps, withAuth } from '../HOCs/withAuth';
import { GameScene } from '../components/GameScene';
import { ContentToShowType, useGameHistory } from '../hooks/useGameHistory';
import { Elderly } from '../components/Elderly';
import { ElderlyScene } from '../components/ElderlyScene';

export function GameBase({ user }: WithAuthProps) {
    const { actions, dialog, contentType, karma } = useGameHistory(user);

    if (!user) return <Navigate to="/" />;

    if (contentType === ContentToShowType.dialog) {
        return (
            <div className="w-full h-full flex justify-center">
                <div className="h-full w-[1050px]">
                    <ActionMessage height="full" actions={actions}>
                        {dialog}
                    </ActionMessage>
                </div>
            </div>
        );
    }

    if (contentType === ContentToShowType.karma) {
        return (
            <div className="flex flex-row items-center w-full h-full place-content-center">
                <div className="absolute w-[1050px] h-[834px]">
                    <ElderlyScene karma={karma} />
                    <div className="absolute bottom-0 w-[1050px]">
                        <ActionMessage actions={actions}>{dialog}</ActionMessage>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row items-center w-full h-full place-content-center">
            <div className="absolute w-[1050px] h-[834px]">
                <GameScene />
                <div className="absolute bottom-0 w-[1050px]">
                    <ActionMessage actions={actions}>{dialog}</ActionMessage>
                </div>
            </div>
        </div>
    );
}

export const Game = withAuth(GameBase);

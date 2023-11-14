import { useEffect } from 'react';
import { Timestamp, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import {
    TrackKarma,
    changeToNextTrack,
    cleanupTimeout,
    scheduleSkip,
    useGameHistoryStore,
    DriverMoodType,
} from '../stores/gameHistory';
import { ButtonActions } from '../components/ActionMessage';
import { firestore } from '../utils/firebase';

const DEFAULT_TIMEOUT = 2000;

const { skip, changeTrack, updateKarma, resetKarma, updateDriverMood, setCurrentKarmaDocPath } =
    useGameHistoryStore.getState();

function skipIndex() {
    skip();
}

function changeTrackToInit() {
    resetKarma();
    changeTrack('init');
}

function setKarmaTrackOnDb(karma: TrackKarma) {
    const { currentKarmaDocPath, track, karma: value } = useGameHistoryStore.getState();

    currentKarmaDocPath &&
        updateDoc(doc(firestore, currentKarmaDocPath), {
            [`tracks.${track}`]: karma,
            value,
        });
}

const changeTrackToFastDriving = (karma: TrackKarma) => () => {
    changeTrack('fastDriving', karma);
    setKarmaTrackOnDb(karma);
};

const changeTrackToBumper = (karma: TrackKarma) => () => {
    changeTrack('bumper', karma);
    setKarmaTrackOnDb(karma);
};

const changeTrackToDevision = (karma: TrackKarma) => () => {
    changeTrack('devisionTrack', karma);
    setKarmaTrackOnDb(karma);
};

const changeTrackToKeepOnTrack = (karma: TrackKarma) => () => {
    changeTrack('keepOnTrack', karma);
    setKarmaTrackOnDb(karma);
};

const changeTrackToNearTheDestination = (karma: TrackKarma) => () => {
    changeTrack('nearToDestination', karma);
    setKarmaTrackOnDb(karma);
};

const changeTrackToCalculatedKarmaTrack = (karma: TrackKarma) => () => {
    // TODO: calculate karma
    updateKarma(karma);
    setKarmaTrackOnDb(karma);

    const { karma: newKarma } = useGameHistoryStore.getState();

    if (newKarma >= 0) {
        changeTrack('goodEnd');
        return;
    }

    changeTrack('badEnd');
};

export enum ContentToShowType {
    dialog = 'dialog',
    karma = 'karma',
    actions = 'actions',
}

const gameHistoryInit = [
    {
        contentType: ContentToShowType.dialog,
        dialog: 'Você está no carro com seu filho e pai idoso, que tem uma consulta médica marcada. Ele está um pouco ansioso e precisa chegar lá com tranquilidade. O trânsito está complicado, e você pode sentir a impaciência dos outros motoristas ao redor.',
        driverMood: 'hurried',
        waitToNext: 15000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Você começa em uma área residencial. As ruas estão relativamente calmas, mas há uma construção à frente, com um desvio indicado.',
        waitToNext: 12000,
        driverMood: 'angry',
        actions: [
            { id: '1', children: 'Seguir o desvio', onClick: changeTrackToDevision(TrackKarma.good) },
            {
                id: '2',
                children: 'Ignorar o desvio e tentar passar pela construção',
                onClick: changeTrackToKeepOnTrack(TrackKarma.bad),
            },
        ],
    },
];

const gameHistoryDevisionTrack = [
    {
        contentType: ContentToShowType.karma,
        dialog: 'O desvio leva você a uma rua movimentada com tráfego pesado.',
        driverMood: 'angry',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'O seu pai começa a ficar nervoso devido ao atraso.',
        driverMood: 'hurried',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Um pedestre está atravessando lentamente na faixa de pedestres à frente.',
        driverMood: 'angry',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Você decide...',
        waitToNext: 12000,
        actions: [
            {
                id: '1',
                children: 'Manter a calma e esperar pacientemente o pedestre atravessar.',
                onClick: changeTrackToFastDriving(TrackKarma.good),
            },
            {
                id: '2',
                children: 'Mostrar impaciência, buzinar para o pedestre e arriscar passar rapidamente.',
                onClick: changeTrackToFastDriving(TrackKarma.bad),
            },
        ],
    },
];

const gameHistoryKeepOnTrack = [
    {
        contentType: ContentToShowType.karma,
        dialog: 'Tentar passar pela construção resulta em um atraso devido a um caminhão bloqueando a passagem.',
        driverMood: 'angry',
        waitToNext: 6000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'O seu pai começa a ficar nervoso devido ao atraso.',
        driverMood: 'hurried',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Motoristas começam a discutir entre si.',
        driverMood: 'angry',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Você decide...',
        waitToNext: 12000,
        actions: [
            {
                id: '1',
                children: 'Tranquilizar o seu pai explicando a situação.',
                onClick: changeTrackToFastDriving(TrackKarma.good),
            },
            {
                id: '2',
                children: 'Expressar sua frustração, aumentando a tensão no carro.',
                onClick: changeTrackToFastDriving(TrackKarma.bad),
            },
        ],
    },
];

const gameHistoryFastDriving = [
    {
        contentType: ContentToShowType.karma,
        dialog: 'Enquanto você está dirigindo rapidamente, o seu pai começa a se queixar de tonturas e desconforto.',
        driverMood: 'hurried',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'O seu pai começa a ficar desconfortável',
        driverMood: 'angry',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Você decide...',
        waitToNext: 12000,
        actions: [
            {
                id: '1',
                children: 'Reduzir a velocidade e perguntar ao seu pai como ele está se sentindo.',
                onClick: changeTrackToBumper(TrackKarma.good),
            },
            {
                id: '2',
                children: 'Manter a velocidade, priorizando chegar ao destino o mais rápido possível.',
                onClick: changeTrackToBumper(TrackKarma.bad),
            },
        ],
    },
];

const gameHistoryBumper = [
    {
        contentType: ContentToShowType.karma,
        dialog: 'De repente, um quebra-mola aparece à frente. Você tem pouco tempo para reagir.',
        driverMood: 'hurried',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Você decide...',
        waitToNext: 12000,
        actions: [
            {
                id: '1',
                children: 'Frear bruscamente para reduzir a velocidade antes do quebra-mola.',
                onClick: changeTrackToNearTheDestination(TrackKarma.good),
            },
            {
                id: '2',
                children: 'Tentar passar pelo quebra-mola na velocidade atual, esperando que não seja tão alto.',
                onClick: changeTrackToNearTheDestination(TrackKarma.bad),
            },
        ],
    },
];

const gameHistoryNearToDestination = [
    {
        contentType: ContentToShowType.karma,
        dialog: 'Chegando ao consultório, todos os espaços de estacionamento estão ocupados.',
        driverMood: 'angry',
        waitToNext: 6000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'É preciso encontrar rapidamente um lugar para estacionar.',
        driverMood: 'hurried',
        waitToNext: 5000,
        actions: [
            {
                id: '1',
                children: 'pular',
                onClick: skipIndex,
            },
        ],
    },
    {
        dialog: 'O seu pai precisa de ajuda para sair do carro devido à sua mobilidade reduzida.',
        waitToNext: 5000,
        actions: [{ id: '1', children: 'pular', onClick: skipIndex }],
    },
    {
        dialog: 'Você decide...',
        waitToNext: 12000,
        actions: [
            {
                id: '1',
                children: 'Parar em um local proibido momentaneamente para ajudar o seu pai a sair.',
                onClick: changeTrackToCalculatedKarmaTrack(TrackKarma.good),
            },
            {
                id: '2',
                children: 'Dar mais uma volta procurando um espaço legal para estacionar.',
                onClick: changeTrackToCalculatedKarmaTrack(TrackKarma.bad),
            },
        ],
    },
];

const gameHistoryGoodEnd = [
    {
        contentType: ContentToShowType.karma,
        dialog: 'O seu pai está visivelmente mais tranquilo e agradece pelo cuidado e paciência. Ele menciona como se sentiu seguro e confortável durante a viagem, apesar do trânsito difícil. Este momento é caloroso e afetuoso.',
        driverMood: 'calm',
        waitToNext: 12000,
    },
    {
        contentType: ContentToShowType.actions,
        driverMood: 'calm',
        dialog: 'Obrigado por jogar',
        end: true,
    },
];

const gameHistoryBadEnd = [
    {
        contentType: ContentToShowType.karma,
        driverMood: 'angry',
        dialog: 'O seu pai parece abalado e desconfortável. Ele comenta sobre a importância de ser mais cuidadoso e paciente, especialmente ao transportar alguém em condições vulneráveis. Ele expressa que não se sentiu seguro durante a viagem, o que pode ter agravado seu nervosismo para a consulta.',
        waitToNext: 6000,
    },
    {
        contentType: ContentToShowType.karma,
        dialog: 'Você decide...',
        end: true,
        actions: [{ id: '1', children: 'Tentar se colocar no lugar do outro', onClick: changeTrackToInit }],
    },
];

const gameHistory = {
    init: gameHistoryInit,
    devisionTrack: gameHistoryDevisionTrack,
    keepOnTrack: gameHistoryKeepOnTrack,
    fastDriving: gameHistoryFastDriving,
    bumper: gameHistoryBumper,
    nearToDestination: gameHistoryNearToDestination,
    goodEnd: gameHistoryGoodEnd,
    badEnd: gameHistoryBadEnd,
};

export type TrackType = keyof typeof gameHistory;

export function useGameHistory(user: User | null | undefined) {
    const { track, historyIndex, karma } = useGameHistoryStore(state => ({
        track: state.track,
        historyIndex: state.historyIndex,
        karma: state.karma,
    }));

    useEffect(() => {
        const {
            actions,
            waitToNext: waitUntil = DEFAULT_TIMEOUT,
            driverMood = 'serious',
            end,
        } = gameHistory[track][historyIndex] as {
            actions: ButtonActions[] | undefined;
            waitToNext: number | undefined;
            driverMood: DriverMoodType | undefined;
            end: boolean | undefined;
        };

        const hasNext = gameHistory[track][historyIndex + 1] !== undefined;
        updateDriverMood(driverMood);

        if (!end) {
            if (user && track === 'init' && !hasNext) {
                const docRef = doc(collection(firestore, 'users', user.uid, 'karma'));

                setDoc(docRef, {
                    value: useGameHistoryStore.getState().karma,
                    createdAt: Timestamp.now(),
                    ended: false,
                    karma: {},
                });

                setCurrentKarmaDocPath(docRef.path);
            }

            hasNext && scheduleSkip(waitUntil);
            !hasNext && actions && changeToNextTrack(waitUntil, actions);
        } else {
            const { currentKarmaDocPath, karma: value } = useGameHistoryStore.getState();

            user &&
                currentKarmaDocPath &&
                updateDoc(doc(firestore, currentKarmaDocPath), {
                    ended: true,
                    value,
                });
        }

        return () => {
            !end && cleanupTimeout();
        };
    }, [historyIndex, track, user]);

    const {
        contentType = ContentToShowType.actions,
        dialog,
        actions,
    } = gameHistory[track][historyIndex] as {
        contentType: ContentToShowType.karma;
        dialog: string;
        actions: ButtonActions[] | undefined;
    };

    return {
        contentType,
        dialog,
        actions,
        karma,
    };
}

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { TrackType } from '../hooks/useGameHistory';
import { ButtonActions } from '../components/ActionMessage';
import { auth } from '../utils/firebase';

export enum TrackKarma {
    good = 'good',
    bad = 'bad',
}

export type DriverMoodType = 'serious' | 'hurried' | 'angry' | 'calm';

interface GameHistoryState {
    track: TrackType;
    karma: number;
    historyIndex: number;
    timeoutId: NodeJS.Timeout | null;
    driverMood: DriverMoodType;
    currentKarmaDocPath?: string;
    setCurrentKarmaDocPath: (path: string) => void;
    updateDriverMood: (mood: DriverMoodType) => void;
    skip: () => void;
    resetKarma: () => void;
    updateKarma: (trackKarma: TrackKarma) => void;
    changeTrack: (track: TrackType, trackKarma?: TrackKarma) => void;
    setTimeoutId: (id: NodeJS.Timeout) => void;
    resetStore: () => void;
}

export const useGameHistoryStore = create(
    subscribeWithSelector<GameHistoryState>((set, get) => ({
        track: 'init',
        karma: 0,
        historyIndex: 0,
        timeoutId: null,
        driverMood: 'hurried',
        currentKarmaDocPath: undefined,
        setCurrentKarmaDocPath: path => set({ currentKarmaDocPath: path }),
        skip: () => set(state => ({ historyIndex: state.historyIndex + 1 })),
        resetKarma: () => set({ karma: 0 }),
        updateDriverMood: (mood: DriverMoodType) => set({ driverMood: mood }),
        updateKarma: (trackKarma: TrackKarma) =>
            set(state => ({
                karma: trackKarma === TrackKarma.good ? state.karma + 1 : state.karma - 1,
            })),
        changeTrack: (track, trackKarma) => {
            trackKarma && get().updateKarma(trackKarma);

            set({
                track,
                historyIndex: 0,
            });
        },
        setTimeoutId: timeoutId => set({ timeoutId }),
        resetStore: () => set({ track: 'init', karma: 0, historyIndex: 0, timeoutId: null, driverMood: 'hurried' }),
    })),
);

const { setTimeoutId, skip, resetStore } = useGameHistoryStore.getState();

export const scheduleSkip = (waitUntil: number) =>
    new Promise(r => {
        setTimeoutId(setTimeout(r, waitUntil));
    }).then(skip);

export const changeToNextTrack = (waitUntil: number, actions: ButtonActions[]) =>
    new Promise(r => {
        setTimeoutId(setTimeout(r, waitUntil));
    }).then(actions?.[1]?.onClick);

export function cleanupTimeout() {
    const { timeoutId } = useGameHistoryStore.getState();
    timeoutId && clearTimeout(timeoutId);
}

useGameHistoryStore.subscribe(state => state.historyIndex, cleanupTimeout, {
    equalityFn: shallow,
    fireImmediately: false,
});

auth.onAuthStateChanged(user => !user && resetStore());

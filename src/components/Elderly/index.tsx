import { Sprite, Stage } from '@pixi/react';
import elderRelaxed from './assets/elder-relaxed.png';
import elderUncomfortable from './assets/elder-uncomfortable.png';
import elderAngry from './assets/elder-angry.png';

interface Props {
    karma: number;
}

export function Elderly({ karma }: Props) {
    const elderlyUnhappy = karma > -2 ? elderAngry : elderUncomfortable;
    const elderly = karma > 0 ? elderRelaxed : elderlyUnhappy;

    return (
        <Stage height={700} width={1050} options={{ background: 0xffffff }}>
            <Sprite image={elderly} />
        </Stage>
    );
}

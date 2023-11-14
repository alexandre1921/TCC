import { Button } from 'flowbite-react';
import { PropsWithChildren } from 'react';
import { VariantProps, tv } from 'tailwind-variants';

const actionMessageContainer = tv({
    base: 'w-full bottom-0 bg-black flex flex-col justify-center',
    variants: {
        height: {
            full: 'h-full',
            default: '',
        },
    },
    defaultVariants: {
        height: 'default',
    },
});

export type ButtonActions = {
    id: string;
    children: string | JSX.Element;
    onClick?: () => void;
};

type Props = {
    actions?: ButtonActions[];
    height?: VariantProps<typeof actionMessageContainer>['height'];
};

export function ActionMessage({ children, actions, height }: PropsWithChildren<Props>) {
    return (
        <div className={actionMessageContainer({ height })}>
            <div className="bg-white gap-2 rounded-3xl border-8 border-black flex flex-col">
                <div className="flex-1 font-VT323 text-5xl text-center select-none">{children}</div>
                <div>
                    <hr className="border-2 border-black" />
                    <div className="flex gap-0.5 border-black rounded-3xl [&>:first-child]:rounded-r-[0px] [&>:first-child]:rounded-tl-[0px] [&>:first-child]:border-r-0 [&>:last-child]:rounded-l-[0px] [&>:last-child]:rounded-tr-[0px] [&>:last-child]:border-l-0">
                        {actions?.map?.(({ id, children: buttonChildren, onClick }) => (
                            <Button key={id} color="dark" className="flex-1" onClick={onClick}>
                                <p className="font-VT323 text-3xl">{buttonChildren}</p>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface CenterProps extends Omit<StackProps, 'justifyContent' | 'alignItems'> {
    children: ReactNode;
    direction?: 'row' | 'column';
}

export function Center({ children, direction = 'column', ...props }: CenterProps) {
    return (
        <Stack
            direction={direction}
            justifyContent="center"
            alignItems="center"
            {...props}
        >
            {children}
        </Stack>
    );
}

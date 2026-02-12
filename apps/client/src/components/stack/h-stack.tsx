import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface HStackProps extends Omit<StackProps, 'direction'> {
    children: ReactNode;
    spacing?: number | string;
}

export function HStack({ children, spacing = 1, ...props }: HStackProps) {
    return (
        <Stack direction="row" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

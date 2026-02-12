import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface VStackProps extends Omit<StackProps, 'direction'> {
    children: ReactNode;
    spacing?: number | string;
}

export function VStack({ children, spacing = 1, ...props }: VStackProps) {
    return (
        <Stack direction="column" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

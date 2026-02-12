import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface SpaceBetweenProps extends Omit<StackProps, 'justifyContent'> {
    children: ReactNode;
    direction?: 'row' | 'column';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
}

export function SpaceBetween({
    children,
    direction = 'row',
    alignItems = 'center',
    ...props
}: SpaceBetweenProps) {
    return (
        <Stack
            direction={direction}
            justifyContent="space-between"
            alignItems={alignItems}
            {...props}
        >
            {children}
        </Stack>
    );
}

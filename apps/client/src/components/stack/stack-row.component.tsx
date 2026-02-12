import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface StackRowProps extends Omit<StackProps, 'direction'> {
    children: ReactNode;
    spacing?: number | string;
}


export function StackRowComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowJusCenterComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowJusEndComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowJusBetweenComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartJusCenterComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartJusEndComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartJusBetweenComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndJusCenterComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndJusEndComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndJusBetweenComponent({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

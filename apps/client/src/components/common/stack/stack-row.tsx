import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface StackRowProps extends Omit<StackProps, 'direction'> {
    children: ReactNode;
    spacing?: number | string;
}


export function StackRow({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStart({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEnd({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowJusCenter({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowJusEnd({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowJusBetween({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartJusCenter({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartJusEnd({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignStartJusBetween({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndJusCenter({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndJusEnd({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackRowAlignEndJusBetween({ children, spacing = 1, ...props }: StackRowProps) {
    return (
        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

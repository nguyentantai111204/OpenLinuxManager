import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface StackColProps extends Omit<StackProps, 'direction'> {
    children: ReactNode;
    spacing?: number | string;
}

export function StackCol({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStart({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenter({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEnd({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColJusCenter({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColJusEnd({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColJusBetween({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterJusCenter({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterJusEnd({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterJusBetween({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartJusCenter({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartJusEnd({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartJusBetween({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndJusCenter({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndJusEnd({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndJusBetween({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

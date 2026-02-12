import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

interface StackColProps extends Omit<StackProps, 'direction'> {
    children: ReactNode;
    spacing?: number | string;
}

export function StackColComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColJusCenterComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColJusEndComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColJusBetweenComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterJusCenterComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterJusEndComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignCenterJusBetweenComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="center" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartJusCenterComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartJusEndComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignStartJusBetweenComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-start" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndJusCenterComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" justifyContent="center" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndJusEndComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" justifyContent="flex-end" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

export function StackColAlignEndJusBetweenComponent({ children, spacing = 1, ...props }: StackColProps) {
    return (
        <Stack direction="column" alignItems="flex-end" justifyContent="space-between" spacing={spacing} {...props}>
            {children}
        </Stack>
    );
}

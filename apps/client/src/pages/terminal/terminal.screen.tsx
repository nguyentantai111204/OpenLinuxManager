import { useEffect, useRef, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io, Socket } from 'socket.io-client';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { PageLoading } from '../../components';
import { SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/design';
import { StackColAlignCenterJusCenterComponent, StackColComponent, StackRowComponent } from '../../components/stack';
import { TERMINAL_CONFIG, TERMINAL_WINDOW_COLORS } from '../../constants/terminal';
import 'xterm/css/xterm.css';

export function TerminalScreen() {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal(TERMINAL_CONFIG);

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        const socket = io('/terminal', {
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            setIsLoading(false);
            fitAddon.fit();
            socket.emit('terminal:resize', {
                cols: term.cols,
                rows: term.rows,
            });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            term.writeln('\r\n\x1b[1;31m✖ Disconnected from server\x1b[0m\r\n');
        });

        socket.on('terminal:output', (data: string) => {
            term.write(data);
        });

        socket.on('terminal:error', (error: string) => {
            term.writeln(`\r\n\x1b[1;31m⚠ Error: ${error}\x1b[0m\r\n`);
        });

        socket.on('terminal:exit', ({ code }: { code: number }) => {
            term.writeln(`\r\n\x1b[1;33mℹ Process exited with code ${code}\x1b[0m\r\n`);
        });

        term.onData((data) => {
            socket.emit('terminal:input', data);
        });

        const handleResize = () => {
            fitAddon.fit();
            socket.emit('terminal:resize', {
                cols: term.cols,
                rows: term.rows,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            term.dispose();
        };
    }, []);

    return (
        <Box sx={{ p: SPACING.lg / 8, height: 'calc(100vh - 120px)' }}>
            <StackColComponent spacing={SPACING.lg / 8} sx={{ height: '100%' }}>
                <PageHeaderComponent
                    title="Web Terminal"
                    subtitle="Full shell access to your Linux system"
                    isConnected={isConnected}
                />

                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        backgroundColor: TERMINAL_WINDOW_COLORS.bodyBg,
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${TERMINAL_WINDOW_COLORS.border}`,
                        overflow: 'hidden',
                        boxShadow: SHADOWS.lg,
                    }}
                >
                    <StackRowComponent
                        sx={{
                            height: '36px',
                            backgroundColor: TERMINAL_WINDOW_COLORS.headerBg,
                            borderBottom: `1px solid ${TERMINAL_WINDOW_COLORS.headerBorder}`,
                            px: 2,
                            gap: 1.5,
                        }}
                    >
                        <StackRowComponent spacing={1}>
                            <Box sx={{ width: 12, height: 12, borderRadius: BORDER_RADIUS.full, backgroundColor: TERMINAL_WINDOW_COLORS.dots.red }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: BORDER_RADIUS.full, backgroundColor: TERMINAL_WINDOW_COLORS.dots.yellow }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: BORDER_RADIUS.full, backgroundColor: TERMINAL_WINDOW_COLORS.dots.green }} />
                        </StackRowComponent>

                        <Box
                            sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                flex: 1,
                                textAlign: 'center',
                                mr: 6
                            }}
                        >
                            bash — terminal
                        </Box>
                    </StackRowComponent>

                    <Box sx={{ flex: 1, position: 'relative', p: 1 }}>
                        {isLoading && (
                            <StackColAlignCenterJusCenterComponent
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 1,
                                    backgroundColor: TERMINAL_WINDOW_COLORS.bodyBg,
                                }}
                            >
                                <PageLoading message="Đang kết nối terminal..." />
                            </StackColAlignCenterJusCenterComponent>
                        )}
                        <Box
                            ref={terminalRef}
                            sx={{
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </Box>
                </Paper>
            </StackColComponent>
        </Box>
    );
}


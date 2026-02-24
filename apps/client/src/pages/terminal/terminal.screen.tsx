import { useEffect, useRef, useState } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io, Socket } from 'socket.io-client';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { PageLoading } from '../../components';
import { SPACING, BORDER_RADIUS, COLORS } from '../../constants/design';
import { StackColComponent } from '../../components/stack';
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

        // Initialize xterm.js
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#0d1117',
                foreground: '#c9d1d9',
                cursor: '#58a6ff',
                cursorAccent: '#0d1117',
                black: '#21262d',
                red: '#ff7b72',
                green: '#3fb950',
                yellow: '#d29922',
                blue: '#58a6ff',
                magenta: '#bc8cff',
                cyan: '#39c5cf',
                white: '#b1bac4',
                brightBlack: '#484f58',
                brightRed: '#ffa198',
                brightGreen: '#56d364',
                brightYellow: '#e3b341',
                brightBlue: '#79c0ff',
                brightMagenta: '#d2a8ff',
                brightCyan: '#56d4dd',
                brightWhite: '#ffffff',
            },
            allowProposedApi: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize Socket.io
        const socket = io('/terminal', {
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            setIsLoading(false);
            // Term should fit on connect to ensure backend knows the size
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

        // Cleanup
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
                        backgroundColor: '#0d1117',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Terminal Window Header */}
                    <Box
                        sx={{
                            height: '36px',
                            backgroundColor: '#161b22',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                        </Box>
                        <Box
                            sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '11px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                flex: 1,
                                textAlign: 'center',
                                mr: 6, // Offset for the window buttons
                            }}
                        >
                            bash — terminal
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, position: 'relative', p: 1 }}>
                        {isLoading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#0d1117',
                                }}
                            >
                                <PageLoading message="Đang kết nối terminal..." />
                            </Box>
                        )}
                        <div
                            ref={terminalRef}
                            style={{
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

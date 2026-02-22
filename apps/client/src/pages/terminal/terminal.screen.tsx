import { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io, Socket } from 'socket.io-client';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SPACING, BORDER_RADIUS } from '../../constants/design';
import { StackColComponent, StackColAlignCenterJusCenterComponent } from '../../components/stack';
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
                background: '#0a1929',
                foreground: '#ffffff',
                cursor: '#e8734e',
                cursorAccent: '#0a1929',
                black: '#000000',
                red: '#e57373',
                green: '#81c784',
                yellow: '#ffb74d',
                blue: '#64b5f6',
                magenta: '#ba68c8',
                cyan: '#4dd0e1',
                white: '#ffffff',
                brightBlack: '#616161',
                brightRed: '#ef5350',
                brightGreen: '#66bb6a',
                brightYellow: '#ffa726',
                brightBlue: '#42a5f5',
                brightMagenta: '#ab47bc',
                brightCyan: '#26c6da',
                brightWhite: '#ffffff',
            },
            rows: 30,
            cols: 80,
        });

        // Initialize fit addon
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        // Open terminal in DOM
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Connect via relative path so traffic goes through Vite's /socket.io proxy.
        // Direct cross-port (localhost:4200 → ws://localhost:3000) is blocked by browsers.
        const socket = io('/terminal', {
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        // Socket event handlers
        socket.on('connect', () => {
            console.log('Terminal WebSocket connected');
            setIsConnected(true);
            setIsLoading(false);
        });

        socket.on('disconnect', () => {
            console.log('Terminal WebSocket disconnected');
            setIsConnected(false);
            term.writeln('\r\n\x1b[1;31m=== Connection lost ===\x1b[0m\r\n');
        });

        socket.on('terminal:output', (data: string) => {
            term.write(data);
        });

        socket.on('terminal:error', (error: string) => {
            term.writeln(`\r\n\x1b[1;31mError: ${error}\x1b[0m\r\n`);
        });

        socket.on('terminal:exit', ({ code }: { code: number }) => {
            term.writeln(`\r\n\x1b[1;33mProcess exited with code ${code}\x1b[0m\r\n`);
        });

        // Handle user input
        term.onData((data) => {
            socket.emit('terminal:input', data);
        });

        // Handle terminal resize
        const handleResize = () => {
            fitAddon.fit();
            socket.emit('terminal:resize', {
                cols: term.cols,
                rows: term.rows,
            });
        };

        window.addEventListener('resize', handleResize);

        // Check if socket is already connected (race condition fix)
        if (socket.connected) {
            console.log('Socket already connected on mount');
            setIsConnected(true);
            setIsLoading(false);
        }

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            term.dispose();
        };
    }, []);

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackColComponent spacing={SPACING.lg / 8}>
                <PageHeaderComponent
                    title="Web Terminal"
                    subtitle="Full shell access to your Linux system"
                    isConnected={isConnected}
                />

                {isLoading ? (
                    <StackColAlignCenterJusCenterComponent sx={{ minHeight: '500px' }}>
                        <CircularProgress color="primary" />
                        <Typography
                            variant="body2"
                            sx={{
                                mt: SPACING.md / 8,
                                color: 'text.secondary',
                            }}
                        >
                            Connecting to terminal...
                        </Typography>
                    </StackColAlignCenterJusCenterComponent>
                ) : (
                    <Box
                        sx={{
                            backgroundColor: '#0a1929',
                            borderRadius: BORDER_RADIUS.lg / 8,
                            padding: SPACING.md / 8,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            ref={terminalRef}
                            style={{
                                height: '600px',
                                width: '100%',
                            }}
                        />
                    </Box>
                )}
            </StackColComponent>
        </Box>
    );
}

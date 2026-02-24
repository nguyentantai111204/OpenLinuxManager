import { Box, Typography } from '@mui/material';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/design';
import { StackRowComponent, StackColAlignCenterJusCenterComponent } from '../stack';

interface BrandProps {
    variant?: 'sidebar' | 'header';
}

export function Brand({ variant = 'header' }: BrandProps) {
    const isSidebar = variant === 'sidebar';

    return (
        <StackRowComponent
            sx={{
                gap: 1.5,
                alignItems: 'center',
            }}
            spacing={0}
        >
            <StackColAlignCenterJusCenterComponent
                sx={{
                    width: isSidebar ? 44 : 36,
                    height: isSidebar ? 44 : 36,
                    borderRadius: BORDER_RADIUS.lg,
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                    fontSize: isSidebar ? TYPOGRAPHY.fontSize.xl : TYPOGRAPHY.fontSize.lg,
                    boxShadow: isSidebar ? `0 4px 12px ${COLORS.primary.main}40` : 'none',
                    flexShrink: 0,
                }}
                spacing={0}
            >
                🐧
            </StackColAlignCenterJusCenterComponent>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: isSidebar ? TYPOGRAPHY.fontSize.lg : TYPOGRAPHY.fontSize.base,
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2,
                        color: isSidebar ? COLORS.sidebar.text : 'inherit',
                    }}
                >
                    Ubuntu
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: COLORS.primary.main,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        textTransform: 'uppercase',
                        fontSize: isSidebar ? '0.65rem' : '0.6rem',
                        letterSpacing: '1px',
                        lineHeight: 1,
                    }}
                >
                    Monitor Pro
                </Typography>
            </Box>
        </StackRowComponent>
    );
}

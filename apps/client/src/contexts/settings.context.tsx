import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export interface SystemSettings {
    refreshInterval: string;
    logHistorySize: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
    refreshInterval: '5000',
    logHistorySize: '1000'
};

interface SettingsContextType {
    settings: SystemSettings;
    updateSettings: (newSettings: Partial<SystemSettings>) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
    const [settings, setSettings] = useState<SystemSettings>(() => {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        return DEFAULT_SETTINGS;
    });

    const updateSettings = (newSettings: Partial<SystemSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('system_settings', JSON.stringify(updated));
            return updated;
        });
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem('system_settings', JSON.stringify(DEFAULT_SETTINGS));
    };

    const contextValue = useMemo(() => ({
        settings,
        updateSettings,
        resetSettings
    }), [settings]);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
}

import React from 'react';
import {
    TableContainerComponent,
    TableComponent,
    TableHeadComponent,
    TableRowComponent,
    TableCellComponent,
    TableBodyComponent
} from '../../components';
import { ServiceRow, SystemService } from './service-row.part';
import { SPACING } from '../../constants/design';

interface ServiceTableProps {
    services: SystemService[];
    onAction: (name: string, action: 'start' | 'stop' | 'restart' | 'enable' | 'disable') => void;
}

export function ServiceTable({ services = [], onAction }: ServiceTableProps) {
    return (
        <TableContainerComponent>
            <TableComponent stickyHeader>
                <TableHeadComponent>
                    <TableRowComponent>
                        <TableCellComponent>SERVICE NAME & DESCRIPTION</TableCellComponent>
                        <TableCellComponent>STATUS</TableCellComponent>
                        <TableCellComponent>AUTO</TableCellComponent>
                        <TableCellComponent align="right">ACTIONS</TableCellComponent>
                    </TableRowComponent>
                </TableHeadComponent>
                <TableBodyComponent>
                    {services.map((service) => (
                        <ServiceRow
                            key={service.name}
                            service={service}
                            onAction={onAction}
                        />
                    ))}
                    {services.length === 0 && (
                        <TableRowComponent>
                            <TableCellComponent colSpan={3} align="center" sx={{ py: SPACING.xl / 8 }}>
                                No services found
                            </TableCellComponent>
                        </TableRowComponent>
                    )}
                </TableBodyComponent>
            </TableComponent>
        </TableContainerComponent>
    );
}

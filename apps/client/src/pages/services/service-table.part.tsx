import React from 'react';
import {
    TableContainerComponent,
    TableComponent,
    TableHeadComponent,
    TableRowComponent,
    TableCellComponent,
    TableBodyComponent,
    TableEmptyRow
} from '../../components';
import { ServiceRow, SystemService } from './service-row.part';

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
                        <TableEmptyRow colSpan={4} message="Không tìm thấy dịch vụ nào" />
                    )}
                </TableBodyComponent>
            </TableComponent>
        </TableContainerComponent>
    );
}

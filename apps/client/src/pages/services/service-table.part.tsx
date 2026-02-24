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
import { ServiceRow } from './service-row.part';
import { SystemService } from '../../apis/services/services.api';

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
                        <TableCellComponent>TÊN DỊCH VỤ & MÔ TẢ</TableCellComponent>
                        <TableCellComponent>TRẠNG THÁI</TableCellComponent>
                        <TableCellComponent>TỰ CHẠY</TableCellComponent>
                        <TableCellComponent align="right">THAO TÁC</TableCellComponent>
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

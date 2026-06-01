import React from 'react';
import { Badge } from '../../../components/ui';

interface MesaStatusBadgeProps {
  status: 'available' | 'occupied' | 'reserved';
}

export const MesaStatusBadge: React.FC<MesaStatusBadgeProps> = ({ status }) => {
  const variants = {
    available: 'success',
    occupied: 'error',
    reserved: 'warning',
  };

  const labels = {
    available: 'Disponible',
    occupied: 'Ocupada',
    reserved: 'Reservada',
  };

  return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
};

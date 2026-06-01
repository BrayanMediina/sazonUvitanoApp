// Order status labels and colors

export const orderStatus = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  preparing: {
    label: 'Preparando',
    color: 'bg-blue-100 text-blue-800',
    icon: '👨‍🍳',
  },
  ready: {
    label: 'Listo',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800',
    icon: '🎉',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
};

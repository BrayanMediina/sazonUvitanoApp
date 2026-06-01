import React from 'react';

export const UsuarioFormModal: React.FC = () => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Nombre"
        className="w-full px-3 py-2 border rounded-lg"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded-lg"
      />
      <select className="w-full px-3 py-2 border rounded-lg">
        <option>Admin</option>
        <option>Cajero</option>
        <option>Mesero</option>
      </select>
    </div>
  );
};

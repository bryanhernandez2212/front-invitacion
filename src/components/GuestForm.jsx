import { useState, useEffect } from 'react';

export default function GuestForm({ onSaveGuest, onClose, initialData }) {
  const [familyName, setFamilyName] = useState('');
  const [passes, setPasses] = useState('');
  const [table, setTable] = useState('');

  useEffect(() => {
    if (initialData) {
      setFamilyName(initialData.familyName || '');
      setPasses(initialData.passes || '');
      setTable(initialData.table || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!familyName || !passes) return;
    
    onSaveGuest({
      id: initialData?.id,
      familyName,
      passes,
      table,
    });
    
    setFamilyName('');
    setPasses('');
    setTable('');
  };

  return (
    <div className="modal-form-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} type="button">×</button>
      <h3>{initialData ? 'Editar Familia' : 'Nueva Familia'}</h3>
      <form className="vertical-form" onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Nombre de la Familia</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ej. Familia Rodríguez"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Total de Pases</label>
          <input 
            type="number" 
            className="form-control" 
            placeholder="Ej. 4"
            min="1"
            value={passes}
            onChange={(e) => setPasses(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Mesa Asignada</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ej. 12"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button type="button" className="btn btn-action" onClick={onClose} style={{ flex: 1 }}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>
            {initialData ? 'Guardar Cambios' : 'Agregar Familia'}
          </button>
        </div>
      </form>
    </div>
  );
}

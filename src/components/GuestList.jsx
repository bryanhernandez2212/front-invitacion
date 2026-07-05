export default function GuestList({ guests, onUpdateStatus, onDeleteGuest, onEditGuest, activeTab, onSelectGuest }) {

  const getBadgeClass = (status) => {
    switch(status) {
      case 'Confirmed': return 'badge badge-confirmed';
      case 'Arrived': return 'badge badge-arrived';
      default: return 'badge badge-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'Confirmed': return 'Confirmado';
      case 'Arrived': return 'Ya Llegó';
      default: return 'Pendiente';
    }
  };

  const getEmptyMessage = () => {
    switch(activeTab) {
      case 'Pending': return 'No hay familias pendientes.';
      case 'Confirmed': return 'No hay familias confirmadas aún.';
      case 'Arrived': return 'Aún no han llegado familias.';
      default: return 'No hay familias registradas. Haz clic en "Agregar Familia".';
    }
  };

  return (
    <div className="list-section">
      <div className="table-wrapper">
        <table className="guest-table">
          <thead>
            <tr>
              <th>Familia</th>
              <th>Pases</th>
              <th>Mesa</th>
              <th>Estatus</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center" style={{padding: '4rem', color: 'var(--text-muted)'}}>
                  <p style={{fontSize: '1.1rem'}}>{getEmptyMessage()}</p>
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr
                  key={guest.id}
                  className={`guest-row ${guest.status === 'Arrived' ? 'row-arrived' : ''}`}
                  onClick={() => guest.status === 'Arrived' && onSelectGuest(guest)}
                >
                  <td data-label="Familia" className="family-name">{guest.familyName}</td>
                  <td data-label="Pases">{guest.passes}</td>
                  <td data-label="Mesa">{guest.table !== 'Sin mesa' ? `Mesa ${guest.table}` : 'Sin mesa'}</td>
                  <td data-label="Estatus">
                    <span className={getBadgeClass(guest.status)}>
                      {getStatusLabel(guest.status)}
                    </span>
                  </td>
                  <td data-label="Acción" onClick={(e) => e.stopPropagation()}>
                    <div className="action-buttons">
                      {guest.status !== 'Arrived' && (
                        <button
                          className="btn btn-arrive"
                          onClick={() => onUpdateStatus(guest.id, 'Arrived')}
                        >
                          ✓ Ya Llegó
                        </button>
                      )}
                      {guest.status === 'Arrived' && (
                        <span className="arrived-check">✓</span>
                      )}
                      <div className="admin-actions">
                        <button
                          className="btn btn-icon-sm"
                          onClick={() => onEditGuest(guest)}
                          title="Editar"
                        >✏️</button>
                        <button
                          className="btn btn-icon-sm btn-danger-sm"
                          onClick={() => onDeleteGuest(guest.id)}
                          title="Eliminar"
                        >🗑️</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

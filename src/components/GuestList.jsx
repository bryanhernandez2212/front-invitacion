export default function GuestList({ guests, onUpdateStatus, onDeleteGuest, onEditGuest, activeTab, onSelectGuest }) {
  
  const getBadgeClass = (status) => {
    switch(status) {
      case 'Confirmed': return 'badge badge-confirmed';
      case 'Arrived': return 'badge badge-arrived';
      case 'Pending':
      default: return 'badge badge-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'Confirmed': return 'Confirmado';
      case 'Arrived': return 'Ya Llegaron';
      case 'Pending':
      default: return 'Pendiente';
    }
  };

  const getEmptyMessage = () => {
    switch(activeTab) {
      case 'Pending': return 'No hay familias pendientes de confirmar.';
      case 'Confirmed': return 'No hay familias confirmadas aún.';
      case 'Arrived': return 'Aún no han llegado familias.';
      default: return 'No hay familias registradas aún. Haz clic en "Agregar Familia".';
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
              <th>Acciones</th>
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
                <tr key={guest.id} className="clickable-row" onClick={() => onSelectGuest(guest)}>
                  <td className="family-name clickable-family">{guest.familyName}</td>
                  <td>{guest.passes}</td>
                  <td>{guest.table !== 'Sin mesa' ? `Mesa ${guest.table}` : 'Sin mesa'}</td>
                  <td>
                    <span className={getBadgeClass(guest.status)}>
                      {getStatusLabel(guest.status)}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="action-buttons">
                      {guest.status === 'Pending' && (
                        <button 
                          className="btn btn-action btn-outline-gold"
                          onClick={() => onUpdateStatus(guest.id, 'Confirmed')}
                          title="Marcar como Confirmado"
                        >
                          ✓ Confirmar
                        </button>
                      )}
                      {(guest.status === 'Pending' || guest.status === 'Confirmed') && (
                        <button 
                          className="btn btn-action btn-success"
                          onClick={() => onUpdateStatus(guest.id, 'Arrived')}
                          title="Marcar Llegada"
                        >
                          🥂 Ya Llegó
                        </button>
                      )}
                      
                      <button 
                        className="btn btn-action btn-icon"
                        onClick={() => onEditGuest(guest)}
                        title="Editar Familia"
                      >
                        ✏️
                      </button>

                      <button 
                        className="btn btn-action btn-danger btn-icon"
                        onClick={() => onDeleteGuest(guest.id)}
                        title="Eliminar Familia"
                      >
                        🗑️
                      </button>
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

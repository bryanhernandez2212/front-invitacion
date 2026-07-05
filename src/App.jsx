import { useState, useEffect } from 'react';
import GuestForm from './components/GuestForm';
import GuestList from './components/GuestList';

function App() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null); // State for editing
  const [selectedGuest, setSelectedGuest] = useState(null); // State for the modal

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backinvitacionc.vercel.app/guests');
      const result = await response.json();
      
      if (result && result.data) {
        const mappedGuests = result.data.map(g => {
          let mappedStatus = 'Pending';
          if (g.arrived) {
            mappedStatus = 'Arrived';
          } else if (g.status === 'confirmed') {
            mappedStatus = 'Confirmed';
          }

          return {
            id: g.id,
            familyName: g.name,
            passes: g.count,
            table: g.table || 'Sin mesa',
            status: mappedStatus,
            original: g
          };
        });
        setGuests(mappedGuests);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGuest = async (guestData) => {
    try {
      const payload = {
        name: guestData.familyName,
        count: parseInt(guestData.passes, 10),
        table: parseInt(guestData.table, 10) || 0
      };

      let url = 'https://backinvitacionc.vercel.app/guests';
      let method = 'POST';

      if (guestData.id) {
        // Editing existing guest
        url = `https://backinvitacionc.vercel.app/guests/${guestData.id}`;
        method = 'PATCH';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchGuests();
        handleCloseForm();
      } else {
        console.error('Failed to save guest', await response.text());
        alert('Hubo un error al guardar la familia.');
      }
    } catch (error) {
      console.error('Error post/patch guest:', error);
      alert('Error de conexión.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      let payload = {};
      if (newStatus === 'Confirmed') {
        payload = { status: 'confirmed' };
      } else if (newStatus === 'Arrived') {
        payload = { arrived: true };
      }

      const response = await fetch(`https://backinvitacionc.vercel.app/guests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setGuests(guests.map(guest => 
          guest.id === id ? { ...guest, status: newStatus } : guest
        ));
      } else {
        console.error('Failed to update status', await response.text());
        alert('Hubo un error al actualizar el estatus.');
      }
    } catch (error) {
      console.error('Error update guest:', error);
      alert('Error de conexión.');
    }
  };

  const handleDeleteGuest = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta familia?')) return;
    
    try {
      const response = await fetch(`https://backinvitacionc.vercel.app/guests/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGuests(guests.filter(guest => guest.id !== id));
      } else {
        console.error('Failed to delete guest', await response.text());
        alert('Hubo un error al eliminar la familia.');
      }
    } catch (error) {
      console.error('Error delete guest:', error);
      alert('Error de conexión.');
    }
  };

  const handleEditClick = (guest) => {
    setEditingGuest(guest);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setTimeout(() => setEditingGuest(null), 300); // Wait for transition
  };

  // Calculate Stats
  const totalPasses = guests.reduce((acc, g) => acc + g.passes, 0);
  const totalConfirmed = guests.filter(g => g.status === 'Confirmed' || g.status === 'Arrived').reduce((acc, g) => acc + g.passes, 0);
  const totalArrived = guests.filter(g => g.status === 'Arrived').reduce((acc, g) => acc + g.passes, 0);
  const totalPending = guests.filter(g => g.status === 'Pending').reduce((acc, g) => acc + g.passes, 0);

  const filteredGuests = guests.filter(guest => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return guest.status === 'Pending';
    if (activeTab === 'Confirmed') return guest.status === 'Confirmed';
    if (activeTab === 'Arrived') return guest.status === 'Arrived';
    return true;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <h1>Recepción</h1>
          <p>Gestión de Invitados</p>
        </div>
        <button 
          className="btn btn-gold main-add-btn" 
          onClick={() => setShowAddForm(true)}
        >
          + Agregar Familia
        </button>
      </header>
      
      <main>
        {/* Dashboard Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-value">{totalPasses}</span>
            <span className="stat-label">Total Personas (Pases)</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalPending}</span>
            <span className="stat-label">Personas Pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalConfirmed}</span>
            <span className="stat-label">Personas Confirmadas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalArrived}</span>
            <span className="stat-label">Ya en Recepción</span>
          </div>
        </div>

        {/* Form Modal */}
        {showAddForm && (
          <div className="modal-overlay" onClick={handleCloseForm}>
            <GuestForm 
              onSaveGuest={handleSaveGuest} 
              onClose={handleCloseForm} 
              initialData={editingGuest}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => setActiveTab('All')}
          >
            Gestionar Familias
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('Pending')}
          >
            Pendientes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Confirmed' ? 'active' : ''}`}
            onClick={() => setActiveTab('Confirmed')}
          >
            Confirmadas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Arrived' ? 'active' : ''}`}
            onClick={() => setActiveTab('Arrived')}
          >
            Ya Llegaron
          </button>
        </div>

        {/* Guest List */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando lista de invitados...</p>
          </div>
        ) : (
          <GuestList 
            guests={filteredGuests} 
            onUpdateStatus={handleUpdateStatus}
            onDeleteGuest={handleDeleteGuest}
            onEditGuest={handleEditClick}
            activeTab={activeTab} 
            onSelectGuest={setSelectedGuest}
          />
        )}
      </main>

      {/* Guest Modal */}
      {selectedGuest && (
        <div className="modal-overlay" onClick={() => setSelectedGuest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedGuest(null)}>×</button>
            <div className="modal-welcome">¡Bienvenidos!</div>
            <div className="modal-family">{selectedGuest.familyName}</div>
            <div className="modal-table-label">Su mesa asignada es la</div>
            <div className="modal-table-number">{selectedGuest.table}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

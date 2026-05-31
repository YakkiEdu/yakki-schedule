import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import type { RoomType } from '../types';
import { ROOM_TYPE_LABELS } from '../types';

const roomTypes: RoomType[] = ['regular', 'lab', 'gym', 'art', 'library'];

export function RoomsManager() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useStore();
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomType>('regular');
  const [newRoomCapacity, setNewRoomCapacity] = useState<string>('');

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      addRoom(
        newRoomName.trim(),
        newRoomType,
        newRoomCapacity ? parseInt(newRoomCapacity) : undefined
      );
      setNewRoomName('');
      setNewRoomType('regular');
      setNewRoomCapacity('');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.rooms.title}</h2>
        </div>

        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <input
              type="text"
              className="form-input"
              placeholder={he.rooms.name}
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <select
              className="form-select"
              value={newRoomType}
              onChange={(e) => setNewRoomType(e.target.value as RoomType)}
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {ROOM_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <input
              type="number"
              className="form-input"
              placeholder={he.rooms.capacity}
              value={newRoomCapacity}
              onChange={(e) => setNewRoomCapacity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddRoom}>
            {he.rooms.add}
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚪</div>
            <p>{he.rooms.noRooms}</p>
          </div>
        ) : (
          <ul className="list">
            {rooms.map((room) => (
              <li key={room.id} className="list-item">
                <div className="list-item-content">
                  <strong>{room.name}</strong>
                  <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                    ({ROOM_TYPE_LABELS[room.type]})
                  </span>
                  {room.capacity && (
                    <span style={{ color: 'var(--text-secondary)' }}>
                      | {he.rooms.capacity}: {room.capacity}
                    </span>
                  )}
                </div>
                <div className="list-item-actions">
                  <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={room.type}
                    onChange={(e) =>
                      updateRoom(room.id, { type: e.target.value as RoomType })
                    }
                  >
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {ROOM_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteRoom(room.id)}
                  >
                    {he.common.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

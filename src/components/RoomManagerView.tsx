import React, { useState } from 'react';
import { SavedRoom, Dimensions } from '../types';
import {
  Ruler,
  Plus,
  Trash2,
  Edit2,
  Box,
  DoorClosed,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface RoomManagerViewProps {
  rooms: SavedRoom[];
  onAddRoom: (room: Omit<SavedRoom, 'id' | 'createdAt'>) => void;
  onUpdateRoom: (room: SavedRoom) => void;
  onDeleteRoom: (roomId: string) => void;
  onTestInRoom: (room: SavedRoom) => void;
}

const ROOM_PRESETS = [
  { name: 'Sala de Estar', type: 'Sala', width: 340, depth: 420, height: 260, door: 80, notes: 'Espaço principal para sofá e rack de TV' },
  { name: 'Quarto Casal', type: 'Quarto', width: 320, depth: 360, height: 260, door: 70, notes: 'Destinado a cama Queen e guarda-roupa' },
  { name: 'Cozinha Planejada', type: 'Cozinha', width: 240, depth: 380, height: 260, door: 80, notes: 'Bancada de pia e nicho da geladeira' },
  { name: 'Lavanderia / Serviço', type: 'Lavanderia', width: 160, depth: 220, height: 260, door: 70, notes: 'Tanque e espaço da máquina de lavar' },
  { name: 'Home Office / Escritório', type: 'Escritório', width: 260, depth: 280, height: 260, door: 70, notes: 'Mesa de trabalho e estante para livros' },
];

export const RoomManagerView: React.FC<RoomManagerViewProps> = ({
  rooms,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onTestInRoom,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Sala');
  const [width, setWidth] = useState(300);
  const [depth, setDepth] = useState(350);
  const [height, setHeight] = useState(260);
  const [doorWidth, setDoorWidth] = useState(80);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName('');
    setType('Sala');
    setWidth(300);
    setDepth(350);
    setHeight(260);
    setDoorWidth(80);
    setNotes('');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleStartEdit = (room: SavedRoom) => {
    setEditingId(room.id);
    setName(room.name);
    setType(room.type);
    setWidth(room.dimensions.width);
    setDepth(room.dimensions.depth);
    setHeight(room.dimensions.height);
    setDoorWidth(room.doorWidth || 80);
    setNotes(room.notes || '');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateRoom({
        id: editingId,
        name: name.trim(),
        type,
        dimensions: { width, depth, height },
        doorWidth,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      });
    } else {
      onAddRoom({
        name: name.trim(),
        type,
        dimensions: { width, depth, height },
        doorWidth,
        notes: notes.trim(),
      });
    }
    resetForm();
  };

  const handleApplyPreset = (preset: typeof ROOM_PRESETS[0]) => {
    setName(preset.name);
    setType(preset.type);
    setWidth(preset.width);
    setDepth(preset.depth);
    setHeight(preset.height);
    setDoorWidth(preset.door);
    setNotes(preset.notes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-sora text-[#172A2B]">
            Medir meu espaço
          </h1>
          <p className="text-sm sm:text-base text-[#65716F] mt-1">
            Cadastre os cômodos da sua casa uma única vez e teste sofás, mesas e eletrodomésticos com 1 clique.
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#347F6C] hover:bg-[#296857] text-white text-sm font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Cômodo
          </button>
        )}
      </div>

      {/* Creation / Edit Form Card */}
      {isCreating && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#347F6C]/40 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#E1E3DB] pb-3">
            <h2 className="font-sora font-bold text-lg text-[#172A2B]">
              {editingId ? 'Editar Cômodo' : 'Novo Cômodo'}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-[#65716F] hover:text-[#172A2B] p-1.5 rounded-full hover:bg-[#FAF8F3]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Presets shortcut buttons */}
          {!editingId && (
            <div>
              <span className="block text-xs font-semibold text-[#65716F] mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F47736]" />
                Ou preencher com medidas padrão residenciais brasileiras:
              </span>
              <div className="flex flex-wrap gap-2">
                {ROOM_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] hover:bg-[#E5F0E8] border border-[#E1E3DB] hover:border-[#347F6C] text-xs font-medium text-[#172A2B] transition-colors"
                  >
                    {p.name} ({p.width}×{p.depth} cm)
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Nome do ambiente *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sala de TV, Quarto das Crianças, Cozinha"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-semibold text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Tipo de cômodo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-medium text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden"
              >
                <option value="Sala">Sala de Estar / Jantar</option>
                <option value="Quarto">Quarto</option>
                <option value="Cozinha">Cozinha</option>
                <option value="Lavanderia">Lavanderia / Área de Serviço</option>
                <option value="Escritório">Escritório / Home Office</option>
                <option value="Banheiro">Banheiro</option>
                <option value="Outro">Outro espaço</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Largura útil (cm) *
              </label>
              <input
                type="number"
                required
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-bold text-[#172A2B] text-center focus:border-[#347F6C] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#65716F]">Descontando rodapés</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Profundidade útil (cm) *
              </label>
              <input
                type="number"
                required
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-bold text-[#172A2B] text-center focus:border-[#347F6C] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Pé-direito / Altura (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-bold text-[#172A2B] text-center focus:border-[#347F6C] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#65716F]">Padrão: 260 cm</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Vão da porta (cm)
              </label>
              <input
                type="number"
                value={doorWidth}
                onChange={(e) => setDoorWidth(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-bold text-[#172A2B] text-center focus:border-[#347F6C] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#65716F]">Padrão: 70 ou 80 cm</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172A2B] mb-1">
              Observações e restrições adicionais
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Tomada 220V na parede esquerda, janela com cortina projeta 10cm, viga no teto com 220cm..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-xs text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-[#E1E3DB] text-xs font-semibold text-[#65716F] hover:bg-[#FAF8F3]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#347F6C] hover:bg-[#296857] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Salvar Alterações' : 'Salvar Cômodo'}
            </button>
          </div>
        </form>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const areaM2 = ((room.dimensions.width * room.dimensions.depth) / 10000).toFixed(1);
          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-[#E1E3DB] hover:border-[#347F6C]/40 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F0E8] text-[#347F6C] uppercase tracking-wider mb-1 font-sora">
                      {room.type}
                    </span>
                    <h3 className="text-lg font-bold font-sora text-[#172A2B]">
                      {room.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(room)}
                      className="p-1.5 text-[#65716F] hover:text-[#347F6C] hover:bg-[#FAF8F3] rounded-lg transition-colors"
                      title="Editar medidas deste cômodo"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteRoom(room.id)}
                      className="p-1.5 text-[#65716F] hover:text-[#DC2626] hover:bg-[#FAF8F3] rounded-lg transition-colors"
                      title="Excluir cômodo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dimension Badges */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E1E3DB] text-center">
                  <div className="bg-[#FAF8F3] p-2 rounded-xl">
                    <span className="text-[10px] text-[#65716F] block">Largura</span>
                    <span className="text-sm font-bold font-sora text-[#172A2B]">
                      {room.dimensions.width} cm
                    </span>
                  </div>
                  <div className="bg-[#FAF8F3] p-2 rounded-xl">
                    <span className="text-[10px] text-[#65716F] block">Profundidade</span>
                    <span className="text-sm font-bold font-sora text-[#172A2B]">
                      {room.dimensions.depth} cm
                    </span>
                  </div>
                  <div className="bg-[#FAF8F3] p-2 rounded-xl">
                    <span className="text-[10px] text-[#65716F] block">Área Útil</span>
                    <span className="text-sm font-bold font-sora text-[#347F6C]">
                      {areaM2} m²
                    </span>
                  </div>
                </div>

                {/* Details list */}
                <div className="pt-3 space-y-1.5 text-xs text-[#65716F]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <DoorClosed className="w-3.5 h-3.5 text-[#347F6C]" />
                      Vão livre da porta:
                    </span>
                    <span className="font-semibold text-[#172A2B]">{room.doorWidth || 80} cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pé-direito:</span>
                    <span className="font-semibold text-[#172A2B]">{room.dimensions.height || 260} cm</span>
                  </div>
                  {room.notes && (
                    <p className="pt-1.5 text-[11px] text-[#475569] italic bg-[#FAF8F3] p-2 rounded-lg">
                      "{room.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* 1-Click Test Button */}
              <button
                type="button"
                onClick={() => onTestInRoom(room)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#E5F0E8] hover:bg-[#347F6C] text-[#347F6C] hover:text-white text-xs font-bold transition-all inline-flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" />
                Testar móvel neste cômodo →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

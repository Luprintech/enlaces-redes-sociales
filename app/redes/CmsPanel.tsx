'use client';

import { useEffect, useRef, useState } from 'react';
import { SocialIcon } from '@/components/LandingClient';

interface Profile {
  id: number;
  name: string;
  bio: string;
  image_url: string;
  background_image_url: string;
  background_image_opacity: number;
  background_gradient_opacity: number;
  background_gradient_style: string;
  welcome_text: string;
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  card_color: string;
  cta_title: string;
  cta_url: string;
  cta_description: string;
  contact_label: string;
  contact_url: string;
  contact_icon: string;
  proof_line_1: string;
  proof_line_2: string;
  ga_measurement_id: string;
  meta_pixel_id: string;
}

interface LinkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  thumbnail_url: string;
  icon: string;
  type: string;
  is_active: number;
  is_featured: number;
  sort_order: number;
  clicks: number;
  badge: string;
  custom_color: string;
  size: string;
  show_label: number;
  btn_style: string;
  start_at: string;
  end_at: string;
}

interface Props {
  profile: Profile;
  links: LinkItem[];
  onSignedOut?: () => void;
}

interface ThemePreset {
  id: number;
  name: string;
  created_at: string;
  snapshot: Partial<Profile>;
}

const SOCIAL_ICONS = [
  'instagram','youtube','twitter','tiktok','facebook',
  'linkedin','github','twitch','spotify','discord','website',
];
const LINK_ICONS = [
  'youtube','website','instagram','twitter','tiktok',
  'spotify','github','twitch','discord','linkedin','facebook',
];

const bgDark = '#0D0D1F';
const cardDark = '#1A1040';
const borderColor = '#EC489944';
const grad = 'linear-gradient(135deg, #EC4899, #2563EB)';

// ── Helpers ────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{children}</label>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SegmentControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className="flex-1 py-1.5 text-xs font-medium transition-all"
          style={
            value === o.value
              ? { background: grad, color: 'white' }
              : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Social Card ────────────────────────────────────────────────────────────
function SocialCard({
  item,
  onUpdate,
  onSave,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  dragging,
}: {
  item: LinkItem;
  onUpdate: (item: LinkItem) => void;
  onSave: (item: LinkItem) => void;
  onDelete: (id: number) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  dragging: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const inputStyle = {
    backgroundColor: bgDark,
    border: `1px solid ${borderColor}`,
    color: 'white',
    borderRadius: '12px',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  };

  const iconColor = item.custom_color || '#EC4899';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: cardDark,
        border: `1px solid ${item.is_active ? borderColor : 'rgba(255,255,255,0.06)'}`,
        opacity: dragging ? 0.4 : item.is_active ? 1 : 0.55,
        cursor: 'grab',
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-3">
        {/* Drag handle */}
        <span style={{ color: 'rgba(255,255,255,0.2)', cursor: 'grab', fontSize: 16 }}>⠿</span>

        {/* Icon preview */}
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
          style={{
            background: item.custom_color
              ? `${item.custom_color}22`
              : 'rgba(236,72,153,0.12)',
            color: iconColor,
          }}
        >
          <SocialIcon name={item.icon} size={16} />
        </span>

        <span className="text-white text-sm font-medium flex-1 truncate">{item.title}</span>

        {/* Badge preview */}
        {item.badge && (
          <span
            className="px-1.5 py-0.5 rounded-full text-white font-bold shrink-0"
            style={{ fontSize: 9, background: grad }}
          >
            {item.badge}
          </span>
        )}

        {/* Toggle active */}
        <button
          onClick={() => onUpdate({ ...item, is_active: item.is_active ? 0 : 1 })}
          className="text-xs px-2 py-1 rounded-lg shrink-0 transition-all"
          style={{
            backgroundColor: item.is_active ? '#EC489922' : 'rgba(255,255,255,0.05)',
            color: item.is_active ? '#F472B6' : '#6B7280',
            border: `1px solid ${item.is_active ? '#EC489944' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          {item.is_active ? 'On' : 'Off'}
        </button>

        {/* Expand */}
        <button
          onClick={() => setExpanded((x) => !x)}
          className="text-xs px-2 py-1 rounded-lg shrink-0"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' }}
        >
          {expanded ? '▲' : '▼'}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-300 text-sm shrink-0 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="flex flex-col gap-3 px-4 pb-4 pt-1">
          {/* URL */}
          <Field label="URL">
            <input
              type="url"
              value={item.url}
              onChange={(e) => onUpdate({ ...item, url: e.target.value })}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>

          {/* Icon */}
          <Field label="Red social">
            <div className="grid grid-cols-4 gap-2">
              {SOCIAL_ICONS.map((ico) => (
                <button
                  key={ico}
                  onClick={() => onUpdate({ ...item, icon: ico })}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all"
                  style={{
                    background: item.icon === ico ? `${iconColor}22` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.icon === ico ? iconColor : 'rgba(255,255,255,0.06)'}`,
                    color: item.icon === ico ? iconColor : 'rgba(255,255,255,0.45)',
                  }}
                >
                  <SocialIcon name={ico} size={18} />
                  <span style={{ fontSize: 9 }}>{ico}</span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            {/* Size */}
            <Field label="Tamaño">
              <SegmentControl
                value={item.size || 'md'}
                options={[{ value: 'sm', label: 'S' }, { value: 'md', label: 'M' }, { value: 'lg', label: 'L' }]}
                onChange={(v) => onUpdate({ ...item, size: v })}
              />
            </Field>

            {/* Style */}
            <Field label="Estilo botón">
              <SegmentControl
                value={item.btn_style || 'circle'}
                options={[
                  { value: 'circle', label: '●' },
                  { value: 'rounded', label: '▪' },
                  { value: 'ghost', label: '○' },
                ]}
                onChange={(v) => onUpdate({ ...item, btn_style: v })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Show label */}
            <Field label="Mostrar nombre">
              <SegmentControl
                value={item.show_label ? 'yes' : 'no'}
                options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Sí' }]}
                onChange={(v) => onUpdate({ ...item, show_label: v === 'yes' ? 1 : 0 })}
              />
            </Field>

            {/* Custom color */}
            <Field label="Color propio">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={item.custom_color || '#EC4899'}
                  onChange={(e) => onUpdate({ ...item, custom_color: e.target.value })}
                  className="w-9 h-9 rounded-xl border-0 cursor-pointer"
                />
                {item.custom_color && (
                  <button
                    onClick={() => onUpdate({ ...item, custom_color: '' })}
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    reset
                  </button>
                )}
              </div>
            </Field>
          </div>

          {/* Badge */}
          <Field label="Badge (texto corto, ej: NEW, 🔥, LIVE)">
            <input
              type="text"
              value={item.badge || ''}
              onChange={(e) => onUpdate({ ...item, badge: e.target.value.slice(0, 6) })}
              placeholder="NEW, 🔥, LIVE…"
              maxLength={6}
              style={inputStyle}
            />
          </Field>

          <div className="flex justify-end">
            <button
              onClick={() => onSave(item)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
              style={{ background: grad }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main CmsPanel ──────────────────────────────────────────────────────────
export default function CmsPanel({ profile: initialProfile, links: initialLinks, onSignedOut }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>(
    initialLinks.map((l) => ({
      ...l,
      description: l.description ?? '',
      category: l.category ?? '',
      thumbnail_url: l.thumbnail_url ?? '',
      is_featured: l.is_featured ?? 0,
      clicks: l.clicks ?? 0,
      badge: l.badge ?? '',
      custom_color: l.custom_color ?? '',
      size: l.size ?? 'md',
      show_label: l.show_label ?? 0,
      btn_style: l.btn_style ?? 'circle',
      start_at: l.start_at ?? '',
      end_at: l.end_at ?? '',
    }))
  );
  const [activeTab, setActiveTab] = useState<'profile' | 'socials' | 'links' | 'style'>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [backgroundUploading, setBackgroundUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [newSocial, setNewSocial] = useState({ title: 'Instagram', url: '', icon: 'instagram' });
  const [addingSocial, setAddingSocial] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: 'youtube',
    thumbnail_url: '',
    start_at: '',
    end_at: '',
  });
  const [addingLink, setAddingLink] = useState(false);
  const [uploadingLinkImageId, setUploadingLinkImageId] = useState<number | 'new' | null>(null);
  const [themePresets, setThemePresets] = useState<ThemePreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [savingPreset, setSavingPreset] = useState(false);
  const [dirtyLinks, setDirtyLinks] = useState<Record<number, boolean>>({});
  const [expandedLinks, setExpandedLinks] = useState<Record<number, boolean>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Drag state
  const dragIdx = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const socials = links.filter((l) => l.type === 'social');
  const contentLinks = links.filter((l) => l.type === 'link');

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  function toggleExpandedLink(id: number) {
    setExpandedLinks((items) => ({ ...items, [id]: !items[id] }));
  }

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    onSignedOut?.();
  }

  // ── Profile ──────────────────────────────────────────────────────────────
  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) showMessage('Perfil guardado');
      else showMessage('Error al guardar');
    } catch {
      showMessage('Error de conexión');
    }
    setSaving(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (res.ok) {
        const { url } = await res.json();
        setProfile((p) => ({ ...p, image_url: url }));
        showMessage('Imagen subida');
      } else showMessage('Error subiendo imagen');
    } catch { showMessage('Error de conexión'); }
    setUploading(false);
  }

  async function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackgroundUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (res.ok) {
        const { url } = await res.json();
        setProfile((p) => ({ ...p, background_image_url: url }));
        showMessage('Fondo subido');
      } else showMessage('Error subiendo fondo');
    } catch {
      showMessage('Error de conexión');
    }
    setBackgroundUploading(false);
  }

  async function changePassword() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showMessage('Completá todos los campos de contraseña');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('La nueva contraseña no coincide');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showMessage('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showMessage('Contraseña actualizada');
      } else {
        const data = await res.json().catch(() => null);
        showMessage(data?.error === 'Current password invalid' ? 'La contraseña actual es incorrecta' : 'No se pudo cambiar la contraseña');
      }
    } catch {
      showMessage('Error de conexión');
    }
    setChangingPassword(false);
  }

  // ── Links CRUD ───────────────────────────────────────────────────────────
  async function addItem(type: 'social' | 'link', data: { title: string; url: string; icon: string; thumbnail_url?: string; start_at?: string; end_at?: string }) {
    if (!data.url) return;
    if (type === 'social') setAddingSocial(true);
    else setAddingLink(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type }),
      });
      if (res.ok) {
        const created = await res.json();
        setLinks((l) => [
          ...l,
          {
            ...created,
            badge: created.badge ?? '',
            custom_color: created.custom_color ?? '',
            size: created.size ?? 'md',
            show_label: created.show_label ?? 0,
            btn_style: created.btn_style ?? 'circle',
          },
        ]);
        if (type === 'social') setNewSocial({ title: 'Instagram', url: '', icon: 'instagram' });
        else setNewLink({ title: '', url: '', icon: 'youtube', thumbnail_url: '', start_at: '', end_at: '' });
        showMessage(type === 'social' ? 'Red social agregada' : 'Link agregado');
      }
    } catch { showMessage('Error de conexión'); }
    if (type === 'social') setAddingSocial(false);
    else setAddingLink(false);
  }

  async function persistLink(item: LinkItem) {
    try {
      await fetch(`/api/links/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch { showMessage('Error al actualizar'); }
  }

  function updateLinkLocal(item: LinkItem) {
    setLinks((l) => l.map((ll) => (ll.id === item.id ? item : ll)));
    persistLink(item);
  }

  function updateLinkDraft(id: number, patch: Partial<LinkItem>) {
    setLinks((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setDirtyLinks((items) => ({ ...items, [id]: true }));
  }

  async function saveLink(id: number) {
    const item = links.find((link) => link.id === id);
    if (!item) return;
    await persistLink(item);
    setDirtyLinks((items) => ({ ...items, [id]: false }));
    showMessage('Link guardado');
  }

  async function uploadLinkImage(target: number | 'new', file: File) {
    setUploadingLinkImageId(target);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        showMessage('Error subiendo imagen');
        return;
      }
      const { url } = await res.json();
      if (target === 'new') {
        setNewLink((item) => ({ ...item, thumbnail_url: url }));
      } else {
        updateLinkDraft(target, { thumbnail_url: url });
      }
      showMessage('Imagen subida');
    } catch {
      showMessage('Error de conexión');
    }
    setUploadingLinkImageId(null);
  }

  async function deleteItem(id: number) {
    if (!confirm('¿Eliminar?')) return;
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks((l) => l.filter((ll) => ll.id !== id));
        showMessage('Eliminado');
      }
    } catch { showMessage('Error de conexión'); }
  }

  // ── Drag & drop by type ─────────────────────────────────────────────────
  function handleDragStart(idx: number, id: number) {
    dragIdx.current = idx;
    setDraggingId(id);
  }

  function handleDragOverByType(e: React.DragEvent, idx: number, type: 'social' | 'link') {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;

    const itemsOfType = links.filter((l) => l.type === type).sort((a, b) => a.sort_order - b.sort_order);
    const [moved] = itemsOfType.splice(dragIdx.current, 1);
    itemsOfType.splice(idx, 0, moved);
    dragIdx.current = idx;

    const reordered = itemsOfType.map((item, i) => ({ ...item, sort_order: i }));
    const otherLinks = links.filter((l) => l.type !== type);
    setLinks([...otherLinks, ...reordered]);
    reordered.forEach((item) => persistLink(item));
  }

  function handleDrop() {
    setDraggingId(null);
    dragIdx.current = null;
  }

  // ── Inputs ───────────────────────────────────────────────────────────────
  const inputStyle = {
    backgroundColor: bgDark,
    border: `1px solid ${borderColor}`,
    color: 'white',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  };

  const TABS = [
    { key: 'profile', label: '👤 Perfil' },
    { key: 'socials', label: '📱 Redes' },
    { key: 'links',   label: '🔗 Links' },
    { key: 'style',   label: '🎨 Estilo' },
  ] as const;

  const previewSocials = socials
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const previewLinks = contentLinks
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    fetchThemePresets();
  }, []);

  async function fetchThemePresets() {
    try {
      const res = await fetch('/api/theme-presets');
      if (res.ok) {
        const data = await res.json();
        setThemePresets(data);
      }
    } catch {
      // ignore quietly in UI bootstrap
    }
  }

  function createThemeSnapshot() {
    return {
      primary_color: profile.primary_color,
      secondary_color: profile.secondary_color,
      bg_color: profile.bg_color,
      card_color: profile.card_color,
      background_image_url: profile.background_image_url,
      background_image_opacity: profile.background_image_opacity,
      background_gradient_opacity: profile.background_gradient_opacity,
      background_gradient_style: profile.background_gradient_style,
    };
  }

  async function saveThemePreset() {
    if (!presetName.trim()) {
      showMessage('Poné un nombre para el preset');
      return;
    }
    setSavingPreset(true);
    try {
      const res = await fetch('/api/theme-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: presetName.trim(), snapshot: createThemeSnapshot() }),
      });
      if (res.ok) {
        const created = await res.json();
        setThemePresets((items) => [created, ...items]);
        setPresetName('');
        showMessage('Preset guardado');
      } else {
        showMessage('No se pudo guardar el preset');
      }
    } catch {
      showMessage('Error de conexión');
    }
    setSavingPreset(false);
  }

  function applyThemePreset(preset: ThemePreset) {
    setProfile((p) => ({ ...p, ...preset.snapshot }));
    showMessage(`Preset aplicado: ${preset.name}`);
  }

  async function deleteThemePreset(id: number) {
    try {
      const res = await fetch(`/api/theme-presets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setThemePresets((items) => items.filter((item) => item.id !== id));
        showMessage('Preset eliminado');
      }
    } catch {
      showMessage('Error de conexión');
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgDark }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: cardDark }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: grad }}>
            ⚙️
          </div>
          <span className="text-white font-semibold">Panel Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors">
            Ver sitio →
          </a>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
            Salir
          </button>
        </div>
      </header>

      {/* Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-xl text-white text-sm shadow-lg" style={{ background: grad }}>
          {message}
        </div>
      )}

      <div className="flex flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex-col gap-5">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                activeTab === key
                  ? { background: grad, color: 'white' }
                  : { backgroundColor: cardDark, color: '#9CA3AF', border: `1px solid ${borderColor}` }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── PERFIL ── */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
            <h2 className="text-white font-semibold text-lg">Perfil</h2>
            <div className="flex items-center gap-4">
              {profile.image_url ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden" style={{ border: '3px solid #EC4899' }}>
                  <img src={profile.image_url} alt="perfil" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl" style={{ background: grad }}>👤</div>
              )}
              <div className="flex flex-col gap-2">
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90 disabled:opacity-50" style={{ background: grad }}>
                  {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                </button>
                {profile.image_url && (
                  <button onClick={() => setProfile((p) => ({ ...p, image_url: '' }))} className="text-sm text-red-400 hover:text-red-300">Quitar imagen</button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Nombre</Label>
              <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Bio / Descripción</Label>
              <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Mensaje de bienvenida</Label>
              <textarea value={profile.welcome_text} onChange={(e) => setProfile((p) => ({ ...p, welcome_text: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Prueba social 1">
                <input type="text" value={profile.proof_line_1} onChange={(e) => setProfile((p) => ({ ...p, proof_line_1: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Prueba social 2">
                <input type="text" value={profile.proof_line_2} onChange={(e) => setProfile((p) => ({ ...p, proof_line_2: e.target.value }))} style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="CTA principal">
                <input type="text" value={profile.cta_title} onChange={(e) => setProfile((p) => ({ ...p, cta_title: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="URL CTA principal">
                <input type="url" value={profile.cta_url} onChange={(e) => setProfile((p) => ({ ...p, cta_url: e.target.value }))} style={inputStyle} />
              </Field>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Descripción CTA</Label>
              <textarea value={profile.cta_description} onChange={(e) => setProfile((p) => ({ ...p, cta_description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Botón contacto">
                <input type="text" value={profile.contact_label} onChange={(e) => setProfile((p) => ({ ...p, contact_label: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="URL contacto">
                <input type="url" value={profile.contact_url} onChange={(e) => setProfile((p) => ({ ...p, contact_url: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Icono contacto">
                <select value={profile.contact_icon} onChange={(e) => setProfile((p) => ({ ...p, contact_icon: e.target.value }))} style={inputStyle}>
                  {SOCIAL_ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Google Analytics ID">
                <input type="text" value={profile.ga_measurement_id} onChange={(e) => setProfile((p) => ({ ...p, ga_measurement_id: e.target.value }))} placeholder="G-XXXXXXXXXX" style={inputStyle} />
              </Field>
              <Field label="Meta Pixel ID">
                <input type="text" value={profile.meta_pixel_id} onChange={(e) => setProfile((p) => ({ ...p, meta_pixel_id: e.target.value }))} placeholder="1234567890" style={inputStyle} />
              </Field>
            </div>
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ backgroundColor: bgDark, border: `1px solid ${borderColor}` }}>
              <h3 className="text-white font-medium text-sm">Seguridad</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Cambiá la contraseña de acceso al panel `/redes`.
              </p>
              <Field label="Contraseña actual">
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} style={inputStyle} autoComplete="current-password" />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Nueva contraseña">
                  <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} style={inputStyle} autoComplete="new-password" />
                </Field>
                <Field label="Confirmar nueva contraseña">
                  <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} style={inputStyle} autoComplete="new-password" />
                </Field>
              </div>
              <button onClick={changePassword} disabled={changingPassword} className="self-start px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50" style={{ background: grad }}>
                {changingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
            </div>
            <button onClick={saveProfile} disabled={saving} className="self-start px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all" style={{ background: grad }}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}

        {/* ── REDES SOCIALES ── */}
        {activeTab === 'socials' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Arrastrá para reordenar. Expandí cada red para ver todas las opciones.
            </p>
            {socials.map((social, idx) => (
              <SocialCard
                key={social.id}
                item={social}
                onUpdate={(item) => updateLinkDraft(item.id, item)}
                onSave={(item) => void saveLink(item.id)}
                onDelete={deleteItem}
                onDragStart={() => handleDragStart(idx, social.id)}
                onDragOver={(e) => handleDragOverByType(e, idx, 'social')}
                onDrop={handleDrop}
                dragging={draggingId === social.id}
              />
            ))}

            {/* Add social */}
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
              <h3 className="text-white font-medium text-sm">Agregar red social</h3>
              <div className="grid grid-cols-4 gap-2">
                {SOCIAL_ICONS.map((ico) => (
                  <button
                    key={ico}
                    onClick={() => setNewSocial({ title: ico, url: newSocial.url, icon: ico })}
                    className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all"
                    style={{
                      background: newSocial.icon === ico ? '#EC489922' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${newSocial.icon === ico ? '#EC4899' : 'rgba(255,255,255,0.06)'}`,
                      color: newSocial.icon === ico ? '#EC4899' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    <SocialIcon name={ico} size={18} />
                    <span style={{ fontSize: 9 }}>{ico}</span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={newSocial.url}
                onChange={(e) => setNewSocial((n) => ({ ...n, url: e.target.value }))}
                placeholder="https://instagram.com/tu_usuario"
                style={inputStyle}
              />
              <button
                onClick={() => addItem('social', newSocial)}
                disabled={addingSocial || !newSocial.url}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-all"
                style={{ background: grad }}
              >
                {addingSocial ? 'Agregando...' : '+ Agregar red social'}
              </button>
            </div>
          </div>
        )}

        {/* ── LINKS ── */}
        {activeTab === 'links' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Cards de contenido que aparecen debajo de las redes. Tambien las podes reordenar arrastrando.
            </p>
            {contentLinks.map((link) => (
              <div
                key={link.id}
                draggable
                onDragStart={() => handleDragStart(contentLinks.findIndex((item) => item.id === link.id), link.id)}
                onDragOver={(e) => handleDragOverByType(e, contentLinks.findIndex((item) => item.id === link.id), 'link')}
                onDrop={handleDrop}
                className="rounded-2xl p-4 flex flex-col gap-3 transition-opacity"
                style={{
                  backgroundColor: cardDark,
                  border: `1px solid ${link.is_active ? borderColor : 'rgba(255,255,255,0.06)'}`,
                  opacity: draggingId === link.id ? 0.4 : link.is_active ? 1 : 0.55,
                  cursor: 'grab',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 max-w-[60%]">
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>⠿</span>
                    <span className="text-white font-medium text-sm truncate">{link.title}</span>
                    {dirtyLinks[link.id] && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>
                        Sin guardar
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => toggleExpandedLink(link.id)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' }}
                    >
                      {expandedLinks[link.id] ? '▲' : '▼'}
                    </button>
                    <button
                      onClick={() => updateLinkDraft(link.id, { is_featured: link.is_featured ? 0 : 1 })}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: link.is_featured ? '#2563EB22' : 'rgba(255,255,255,0.05)',
                        color: link.is_featured ? '#60A5FA' : '#6B7280',
                        border: `1px solid ${link.is_featured ? '#2563EB55' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {link.is_featured ? 'Destacado' : 'Normal'}
                    </button>
                    <button
                      onClick={() => updateLinkDraft(link.id, { is_active: link.is_active ? 0 : 1 })}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: link.is_active ? '#EC489922' : 'rgba(255,255,255,0.05)',
                        color: link.is_active ? '#F472B6' : '#6B7280',
                        border: `1px solid ${link.is_active ? '#EC489944' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {link.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                    <button onClick={() => deleteItem(link.id)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                  </div>
                </div>
                {expandedLinks[link.id] && (
                  <>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLinkDraft(link.id, { title: e.target.value })}
                      placeholder="Título"
                      style={inputStyle}
                    />
                    <textarea
                      value={link.description}
                      onChange={(e) => updateLinkDraft(link.id, { description: e.target.value })}
                      placeholder="Descripción breve"
                      rows={2}
                      style={{ ...inputStyle, resize: 'none' }}
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLinkDraft(link.id, { url: e.target.value })}
                      placeholder="https://..."
                      style={inputStyle}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="Categoría">
                        <input
                          type="text"
                          value={link.category}
                          onChange={(e) => updateLinkDraft(link.id, { category: e.target.value })}
                          placeholder="Contenido, Enlaces, Recursos..."
                          style={inputStyle}
                        />
                      </Field>
                      <Field label="Thumbnail URL">
                        <input
                          type="url"
                          value={link.thumbnail_url}
                          onChange={(e) => updateLinkDraft(link.id, { thumbnail_url: e.target.value })}
                          placeholder="https://..."
                          style={inputStyle}
                        />
                      </Field>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${borderColor}` }}>
                        {uploadingLinkImageId === link.id ? 'Subiendo...' : 'Subir imagen'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void uploadLinkImage(link.id, file);
                            e.currentTarget.value = '';
                          }}
                        />
                      </label>
                      {link.thumbnail_url && (
                        <button
                          onClick={() => updateLinkDraft(link.id, { thumbnail_url: '' })}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Quitar imagen
                        </button>
                      )}
                    </div>
                    {link.thumbnail_url && (
                      <div className="relative h-28 w-full overflow-hidden rounded-2xl" style={{ border: `1px solid ${borderColor}` }}>
                        <img src={link.thumbnail_url} alt={link.title} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Field label="Badge">
                        <input
                          type="text"
                          value={link.badge}
                          onChange={(e) => updateLinkDraft(link.id, { badge: e.target.value.slice(0, 6) })}
                          placeholder="NEW"
                          style={inputStyle}
                        />
                      </Field>
                      <Field label="Inicio">
                        <input
                          type="datetime-local"
                          value={link.start_at}
                          onChange={(e) => updateLinkDraft(link.id, { start_at: e.target.value })}
                          style={inputStyle}
                        />
                      </Field>
                      <Field label="Fin">
                        <input
                          type="datetime-local"
                          value={link.end_at}
                          onChange={(e) => updateLinkDraft(link.id, { end_at: e.target.value })}
                          style={inputStyle}
                        />
                      </Field>
                    </div>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                      Clicks registrados: {link.clicks}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {LINK_ICONS.map((ico) => (
                        <button
                          key={ico}
                          onClick={() => updateLinkDraft(link.id, { icon: ico })}
                          className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
                          style={{
                            background: link.icon === ico ? '#EC489922' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${link.icon === ico ? '#EC4899' : 'rgba(255,255,255,0.06)'}`,
                            color: link.icon === ico ? '#EC4899' : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          <SocialIcon name={ico} size={16} />
                          <span style={{ fontSize: 9 }}>{ico}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => void saveLink(link.id)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
                        style={{ background: grad }}
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add link */}
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
              <h3 className="text-white font-medium text-sm">Agregar link</h3>
              <input type="text" value={newLink.title} onChange={(e) => setNewLink((n) => ({ ...n, title: e.target.value }))} placeholder="Título del link" style={inputStyle} />
              <input type="url" value={newLink.url} onChange={(e) => setNewLink((n) => ({ ...n, url: e.target.value }))} placeholder="https://..." style={inputStyle} />
              <input type="url" value={newLink.thumbnail_url} onChange={(e) => setNewLink((n) => ({ ...n, thumbnail_url: e.target.value }))} placeholder="URL de imagen (opcional)" style={inputStyle} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Inicio">
                  <input
                    type="datetime-local"
                    value={newLink.start_at}
                    onChange={(e) => setNewLink((n) => ({ ...n, start_at: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Fin">
                  <input
                    type="datetime-local"
                    value={newLink.end_at}
                    onChange={(e) => setNewLink((n) => ({ ...n, end_at: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>
              </div>
              <div className="flex items-center gap-3">
                <label className="px-3 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${borderColor}` }}>
                  {uploadingLinkImageId === 'new' ? 'Subiendo...' : 'Subir imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadLinkImage('new', file);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
                {newLink.thumbnail_url && (
                  <button onClick={() => setNewLink((n) => ({ ...n, thumbnail_url: '' }))} className="text-xs text-red-400 hover:text-red-300">
                    Quitar imagen
                  </button>
                )}
              </div>
              {newLink.thumbnail_url && (
                <div className="relative h-28 w-full overflow-hidden rounded-2xl" style={{ border: `1px solid ${borderColor}` }}>
                  <img src={newLink.thumbnail_url} alt="preview thumbnail" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="grid grid-cols-4 gap-2">
                {LINK_ICONS.map((ico) => (
                  <button
                    key={ico}
                    onClick={() => setNewLink((n) => ({ ...n, icon: ico }))}
                    className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
                    style={{
                      background: newLink.icon === ico ? '#EC489922' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${newLink.icon === ico ? '#EC4899' : 'rgba(255,255,255,0.06)'}`,
                      color: newLink.icon === ico ? '#EC4899' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <SocialIcon name={ico} size={16} />
                    <span style={{ fontSize: 9 }}>{ico}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => addItem('link', newLink)}
                disabled={addingLink || !newLink.title || !newLink.url}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                style={{ background: grad }}
              >
                {addingLink ? 'Agregando...' : '+ Agregar link'}
              </button>
            </div>
          </div>
        )}

        {/* ── ESTILO ── */}
        {activeTab === 'style' && (
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
            <h2 className="text-white font-semibold text-lg">Estilo visual</h2>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  { key: 'primary_color',   label: 'Color primario (rosa)' },
                  { key: 'secondary_color', label: 'Color secundario (azul)' },
                  { key: 'bg_color',        label: 'Fondo' },
                  { key: 'card_color',      label: 'Color cards' },
                ] as { key: keyof Profile; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1">
                  <Label>{label}</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={profile[key] as string} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))} className="w-10 h-10 rounded-xl border-0 cursor-pointer" />
                    <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{profile[key] as string}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4 flex flex-col gap-4" style={{ backgroundColor: bgDark, border: `1px solid ${borderColor}` }}>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium text-white">Presets de tema</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Guardá combinaciones visuales para reutilizarlas después.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Nombre del preset"
                    style={inputStyle}
                  />
                  <button
                    onClick={saveThemePreset}
                    disabled={savingPreset || !presetName.trim()}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    style={{ background: grad }}
                  >
                    {savingPreset ? 'Guardando...' : 'Guardar preset'}
                  </button>
                </div>
                {themePresets.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {themePresets.map((preset) => (
                      <div key={preset.id} className="rounded-2xl p-3 flex flex-col gap-3" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">{preset.name}</p>
                            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{preset.created_at}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.snapshot.primary_color || '#EC4899' }} />
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.snapshot.secondary_color || '#2563EB' }} />
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.snapshot.card_color || '#1A1040' }} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => applyThemePreset(preset)} className="px-3 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: grad }}>
                            Aplicar
                          </button>
                          <button onClick={() => deleteThemePreset(preset.id)} className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.05)', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">Fondo personalizado</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Subí una imagen de fondo y combinála con el gradiente.
                  </p>
                </div>
                <button onClick={() => backgroundInputRef.current?.click()} disabled={backgroundUploading} className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90 disabled:opacity-50" style={{ background: grad }}>
                  {backgroundUploading ? 'Subiendo...' : 'Subir fondo'}
                </button>
              </div>
              <input ref={backgroundInputRef} type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} />
              {profile.background_image_url && (
                <div className="relative h-28 w-full overflow-hidden rounded-2xl" style={{ border: `1px solid ${borderColor}` }}>
                  <img src={profile.background_image_url} alt="fondo" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Opacidad imagen fondo">
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="1" step="0.05" value={profile.background_image_opacity} onChange={(e) => setProfile((p) => ({ ...p, background_image_opacity: Number(e.target.value) }))} className="w-full" />
                    <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>{profile.background_image_opacity.toFixed(2)}</span>
                  </div>
                </Field>
                <Field label="Opacidad gradiente">
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="1.5" step="0.05" value={profile.background_gradient_opacity} onChange={(e) => setProfile((p) => ({ ...p, background_gradient_opacity: Number(e.target.value) }))} className="w-full" />
                    <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>{profile.background_gradient_opacity.toFixed(2)}</span>
                  </div>
                </Field>
              </div>
              <Field label="Estilo gradiente">
                <SegmentControl
                  value={profile.background_gradient_style || 'aurora'}
                  options={[
                    { value: 'aurora', label: 'Aurora' },
                    { value: 'vivid', label: 'Vivo' },
                    { value: 'radial', label: 'Radial' },
                  ]}
                  onChange={(v) => setProfile((p) => ({ ...p, background_gradient_style: v }))}
                />
              </Field>
              {profile.background_image_url && (
                <button onClick={() => setProfile((p) => ({ ...p, background_image_url: '' }))} className="self-start text-sm text-red-400 hover:text-red-300">
                  Quitar fondo
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Preview</Label>
              <div className="h-14 rounded-xl flex items-center justify-center text-white text-sm font-medium" style={{ background: `linear-gradient(135deg, ${profile.primary_color}, ${profile.secondary_color})` }}>
                Gradiente principal
              </div>
              <div className="h-10 rounded-xl flex items-center px-4 text-white text-sm" style={{ backgroundColor: profile.card_color, border: `1px solid ${profile.primary_color}44` }}>
                Card de ejemplo
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-5 flex flex-col items-center gap-4" style={{ background: profile.background_gradient_style === 'radial' ? 'radial-gradient(circle at 20% 20%, #2a0038 0%, #0d0d2e 45%, #001030 100%)' : profile.background_gradient_style === 'vivid' ? 'linear-gradient(135deg, #30003b 0%, #151b5f 50%, #003c8f 100%)' : 'linear-gradient(135deg, #1a0020 0%, #0d0d2e 50%, #001030 100%)', border: `1px solid ${borderColor}` }}>
              {profile.background_image_url && (
                <div className="absolute inset-0">
                  <img src={profile.background_image_url} alt="background preview" className="object-cover w-full h-full" style={{ opacity: profile.background_image_opacity }} />
                </div>
              )}
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 20%, ${profile.primary_color}2A 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, ${profile.secondary_color}22 0%, transparent 55%)`, opacity: profile.background_gradient_opacity }} />
              <div className="relative z-10 w-full flex flex-col items-center gap-4">
              {profile.image_url ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden" style={{ border: `3px solid ${profile.primary_color}` }}>
                  <img src={profile.image_url} alt="preview" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${profile.primary_color}, ${profile.secondary_color})` }}>
                  👤
                </div>
              )}
              <div className="flex flex-col items-center gap-1">
                <p className="text-white font-semibold">{profile.name || 'Tu Nombre'}</p>
                <p className="text-xs text-center max-w-[240px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{profile.bio || 'Descripcion breve'}</p>
              </div>
              <div className="flex flex-wrap justify-center items-end gap-3">
                {previewSocials.map((item) => {
                  const sizes = { sm: 36, md: 44, lg: 56 } as const;
                  const iconSizes = { sm: 16, md: 20, lg: 24 } as const;
                  const btnSize = sizes[(item.size as keyof typeof sizes) || 'md'] ?? 44;
                  const iconSize = iconSizes[(item.size as keyof typeof iconSizes) || 'md'] ?? 20;
                  const radius = item.btn_style === 'rounded' ? 12 : item.btn_style === 'ghost' ? 0 : 999;
                  return (
                    <div key={item.id} className="relative flex flex-col items-center gap-1">
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 z-10 px-1.5 py-0.5 rounded-full text-white font-bold" style={{ fontSize: 9, background: grad }}>
                          {item.badge}
                        </span>
                      )}
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: btnSize,
                          height: btnSize,
                          borderRadius: radius,
                          background: item.btn_style === 'ghost' ? 'transparent' : 'rgba(255,255,255,0.08)',
                          border: item.btn_style === 'ghost' ? 'none' : `1px solid rgba(255,255,255,0.15)`,
                          color: item.custom_color || profile.primary_color,
                        }}
                      >
                        <SocialIcon name={item.icon} size={iconSize} />
                      </div>
                      {item.show_label === 1 && <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.title}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex flex-col gap-2">
                {previewLinks.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative w-full rounded-2xl px-4 py-3 flex items-center gap-3 text-white text-sm" style={{ backgroundColor: profile.card_color, border: `1px solid ${profile.primary_color}33` }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: `linear-gradient(to bottom, ${profile.primary_color}, ${profile.secondary_color})` }} />
                    <span style={{ color: profile.primary_color }}><SocialIcon name={item.icon} size={16} /></span>
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
              </div>
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} className="self-start px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 disabled:opacity-50" style={{ background: grad }}>
              {saving ? 'Guardando...' : 'Guardar estilo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import LoginForm from '@/app/redes/LoginForm';
import CmsPanel from '@/app/redes/CmsPanel';
import type { LinkItem, Profile, SessionUser } from '@/src/types';

export default function AdminPage() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const sessionRes = await fetch('/api/auth/session', { credentials: 'include' });

    if (!sessionRes.ok) {
      setSession(null);
      setProfile(null);
      setLinks([]);
      setLoading(false);
      return;
    }

    const sessionData = await sessionRes.json();
    if (!sessionData.authenticated) {
      setSession(null);
      setProfile(null);
      setLinks([]);
      setLoading(false);
      return;
    }

    setSession(sessionData.user);

    const [profileRes, linksRes] = await Promise.all([
      fetch('/api/profile', { credentials: 'include' }),
      fetch('/api/links', { credentials: 'include' }),
    ]);

    if (profileRes.ok) setProfile(await profileRes.json());
    if (linksRes.ok) setLinks(await linksRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-white" style={{ background: '#0D0D1F' }}>Cargando...</div>;
  }

  if (!session || !profile) {
    return <LoginForm onSuccess={() => void load()} />;
  }

  return <CmsPanel profile={profile} links={links} onSignedOut={() => void load()} />;
}

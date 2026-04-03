import { useEffect, useState } from 'react';
import LandingClient from '@/components/LandingClient';
import type { LinkItem, Profile } from '@/src/types';

function isScheduledActive(link: LinkItem) {
  const now = Date.now();
  const startOk = !link.start_at || Number.isNaN(Date.parse(link.start_at)) || Date.parse(link.start_at) <= now;
  const endOk = !link.end_at || Number.isNaN(Date.parse(link.end_at)) || Date.parse(link.end_at) >= now;
  return startOk && endOk;
}

export default function PublicPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    async function load() {
      const [profileRes, linksRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/links'),
      ]);

      if (profileRes.ok) setProfile(await profileRes.json());
      if (linksRes.ok) setLinks(await linksRes.json());
    }

    void load();
  }, []);

  if (!profile) {
    return <div className="min-h-screen grid place-items-center text-white" style={{ background: '#0D0D1F' }}>Cargando...</div>;
  }

  const visibleLinks = links.filter((link) => link.is_active && isScheduledActive(link));
  const socials = visibleLinks.filter((link) => link.type === 'social');
  const contentLinks = visibleLinks.filter((link) => link.type === 'link');

  return <LandingClient profile={profile} socials={socials} links={contentLinks} />;
}

'use client';

import React from 'react';
import Image from 'next/image';
import Script from 'next/script';
import StarField from './StarField';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';

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
  badge?: string;
  custom_color?: string;
  size?: string;
  show_label?: number;
  btn_style?: string;
}

interface Props {
  profile: Profile;
  socials: LinkItem[];
  links: LinkItem[];
}

export function SocialIcon({ name, size = 22 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactElement> = {
    instagram: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
    youtube: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" /></svg>,
    twitter: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    tiktok: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.49a4.85 4.85 0 0 1-1-.8z" /></svg>,
    facebook: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
    linkedin: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    github: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
    twitch: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg>,
    spotify: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>,
    discord: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>,
    website: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  };

  return icons[name?.toLowerCase()] ?? <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}

function SocialButton({ social, primaryColor, secondaryColor, isDark }: { social: LinkItem; primaryColor: string; secondaryColor: string; isDark: boolean }) {
  const sizeMap: Record<string, { btn: number; icon: number; label: string }> = {
    sm: { btn: 36, icon: 16, label: 'text-[10px]' },
    md: { btn: 44, icon: 20, label: 'text-xs' },
    lg: { btn: 56, icon: 26, label: 'text-sm' },
  };
  const s = sizeMap[social.size ?? 'md'] ?? sizeMap.md;
  const isGhost = social.btn_style === 'ghost';
  const isRounded = social.btn_style === 'rounded';
  const borderRadius = isGhost ? '0' : isRounded ? '12px' : '50%';
  const activeColor = social.custom_color || primaryColor;
  const defaultBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const defaultBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  const defaultColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';

  return (
    <a href={`/out/${social.id}`} target="_blank" rel="noopener noreferrer" title={social.title} className="relative flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95">
      {social.badge && <span className="absolute -top-1 -right-1 z-10 px-1.5 py-0.5 rounded-full text-white font-bold leading-none" style={{ fontSize: '9px', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, boxShadow: `0 0 8px ${primaryColor}88` }}>{social.badge}</span>}
      <span className="flex items-center justify-center transition-all duration-200" style={{ width: s.btn, height: s.btn, borderRadius, background: isGhost ? 'transparent' : defaultBg, border: isGhost ? 'none' : `1px solid ${defaultBorder}`, color: defaultColor }}>
        <SocialIcon name={social.icon} size={s.icon} />
      </span>
      {social.show_label === 1 && <span className={`${s.label} font-medium leading-none`} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>{social.title}</span>}
    </a>
  );
}

function groupByCategory(links: LinkItem[]) {
  const groups: { name: string; items: LinkItem[] }[] = [];
  for (const link of links) {
    const name = link.category?.trim() || 'Enlaces';
    const existing = groups.find((group) => group.name === name);
    if (existing) existing.items.push(link);
    else groups.push({ name, items: [link] });
  }
  return groups;
}

export default function LandingClient({ profile, socials, links }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primaryColor = profile.primary_color || '#EC4899';
  const secondaryColor = profile.secondary_color || '#2563EB';
  const cardColor = profile.card_color || (isDark ? '#1A1040' : '#FFFFFF');
  const textPrimary = isDark ? '#ffffff' : '#1a0a2e';
  const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(26,10,46,0.6)';
  const gradientOpacity = profile.background_gradient_opacity ?? 1;
  const bgImageOpacity = profile.background_image_opacity ?? 0.28;
  const featuredLink = links.find((link) => link.is_featured === 1) ?? links[0];
  const regularLinks = featuredLink ? links.filter((link) => link.id !== featuredLink.id) : links;
  const groupedLinks = groupByCategory(regularLinks);

  const darkGradient =
    profile.background_gradient_style === 'radial'
      ? 'radial-gradient(circle at 20% 20%, #2a0038 0%, #0d0d2e 45%, #001030 100%)'
      : profile.background_gradient_style === 'vivid'
        ? 'linear-gradient(135deg, #30003b 0%, #151b5f 50%, #003c8f 100%)'
        : 'linear-gradient(135deg, #1a0020 0%, #0d0d2e 50%, #001030 100%)';

  const lightGradient =
    profile.background_gradient_style === 'radial'
      ? 'radial-gradient(circle at 20% 20%, #ffd8ef 0%, #efe8ff 48%, #d8e8ff 100%)'
      : profile.background_gradient_style === 'vivid'
        ? 'linear-gradient(135deg, #ffd0ea 0%, #e1d8ff 48%, #bfe1ff 100%)'
        : 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #dbeafe 100%)';

  return (
    <>
      {profile.ga_measurement_id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${profile.ga_measurement_id}`} strategy="afterInteractive" />
          <Script id="ga-script" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${profile.ga_measurement_id}');
          `}</Script>
        </>
      )}
      {profile.meta_pixel_id && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${profile.meta_pixel_id}');
          fbq('track', 'PageView');
        `}</Script>
      )}

      <StarField palette={isDark ? ['255, 255, 255'] : ['236, 72, 153', '147, 51, 234', '37, 99, 235', '251, 146, 60']} count={isDark ? 120 : 110} />

      <div className="fixed inset-0 transition-all duration-500" style={{ background: isDark ? darkGradient : lightGradient, zIndex: -2 }} />
      {profile.background_image_url && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `url(${profile.background_image_url})`,
            opacity: bgImageOpacity,
            zIndex: -1,
          }}
        />
      )}
      <div className="fixed inset-0 pointer-events-none transition-all duration-500" style={{ background: `radial-gradient(ellipse at 30% 20%, ${primaryColor}${isDark ? '2A' : '18'} 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, ${secondaryColor}${isDark ? '22' : '15'} 0%, transparent 55%)`, opacity: gradientOpacity, zIndex: 1 }} />
      <div className="fixed top-4 right-4 z-50"><ThemeToggle primaryColor={primaryColor} /></div>

      {profile.contact_url && (
        <a href={profile.contact_url} target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff' }}>
          <SocialIcon name={profile.contact_icon || 'website'} size={16} />
          <span className="text-sm">{profile.contact_label || 'Escribime'}</span>
        </a>
      )}

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start py-14 px-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          {profile.image_url ? (
            <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{ border: `3px solid ${primaryColor}`, boxShadow: `0 0 ${isDark ? 32 : 20}px ${primaryColor}${isDark ? '55' : '33'}` }}>
              <Image src={profile.image_url} alt={profile.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, boxShadow: `0 0 ${isDark ? 32 : 20}px ${primaryColor}${isDark ? '55' : '33'}` }}>👤</div>
          )}

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-center transition-colors duration-300" style={{ color: textPrimary, textShadow: isDark ? `0 0 24px ${primaryColor}88` : 'none' }}>{profile.name || 'Tu Nombre'}</h1>
            {profile.bio && <p className="text-sm text-center max-w-xs transition-colors duration-300" style={{ color: textSecondary }}>{profile.bio}</p>}
            {profile.welcome_text && <p className="text-sm text-center max-w-sm rounded-2xl px-4 py-3" style={{ color: textPrimary, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)'}` }}>{profile.welcome_text}</p>}
          </div>

          {(profile.proof_line_1 || profile.proof_line_2) && (
            <div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2">
              {profile.proof_line_1 && <div className="rounded-2xl px-4 py-3 text-sm font-medium text-center" style={{ color: textPrimary, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.75)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)'}` }}>{profile.proof_line_1}</div>}
              {profile.proof_line_2 && <div className="rounded-2xl px-4 py-3 text-sm font-medium text-center" style={{ color: textPrimary, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.75)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)'}` }}>{profile.proof_line_2}</div>}
            </div>
          )}

          {profile.cta_title && profile.cta_url && (
            <a href={profile.cta_url} target="_blank" rel="noopener noreferrer" className="w-full rounded-3xl px-5 py-5 transition-transform hover:scale-[1.01]" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', boxShadow: `0 12px 32px ${primaryColor}33` }}>
              <div className="flex items-start gap-3">
                <div className="mt-1"><SocialIcon name="website" size={18} /></div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{profile.cta_title}</p>
                  {profile.cta_description && <p className="text-sm opacity-90 mt-1">{profile.cta_description}</p>}
                </div>
                <span className="opacity-80">→</span>
              </div>
            </a>
          )}

          {socials.length > 0 && <div className="flex items-end gap-3 flex-wrap justify-center">{socials.map((social) => <SocialButton key={social.id} social={social} primaryColor={primaryColor} secondaryColor={secondaryColor} isDark={isDark} />)}</div>}

          {featuredLink && (
            <a href={`/out/${featuredLink.id}`} target="_blank" rel="noopener noreferrer" className="group relative w-full overflow-hidden rounded-3xl transition-transform hover:scale-[1.01]" style={{ backgroundColor: isDark ? cardColor : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)'}`, color: textPrimary, boxShadow: isDark ? 'none' : '0 8px 24px rgba(0,0,0,0.08)' }}>
              <div className="absolute inset-y-0 left-0 w-1" style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})` }} />
              {featuredLink.thumbnail_url && <div className="relative h-40 w-full"><Image src={featuredLink.thumbnail_url} alt={featuredLink.title} fill className="object-cover" unoptimized /></div>}
              <div className="p-5 flex items-start gap-3">
                <div className="mt-1" style={{ color: primaryColor }}><SocialIcon name={featuredLink.icon} size={18} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-lg font-bold">{featuredLink.title}</p>
                    {featuredLink.badge && <span className="px-2 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>{featuredLink.badge}</span>}
                  </div>
                  {featuredLink.description && <p className="text-sm mt-2" style={{ color: textSecondary }}>{featuredLink.description}</p>}
                  <p className="text-xs mt-3 font-semibold uppercase tracking-[0.2em]" style={{ color: textSecondary }}>{featuredLink.category || 'Destacado'}</p>
                </div>
                <span className="opacity-40 group-hover:opacity-80">→</span>
              </div>
            </a>
          )}

          {groupedLinks.length > 0 && groupedLinks.map((group) => (
            <section key={group.name} className="w-full flex flex-col gap-3">
              <div className="w-full flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)' }} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(26,10,46,0.4)' }}>{group.name}</span>
                <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)' }} />
              </div>
              {group.items.map((link) => (
                <a key={link.id} href={`/out/${link.id}`} target="_blank" rel="noopener noreferrer" className="group relative w-full rounded-2xl transition-all duration-200 hover:scale-[1.02]" style={{ backgroundColor: isDark ? cardColor : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.08)'}`, color: textPrimary, boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl" style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})` }} />
                  <div className="flex items-stretch gap-4 p-4">
                    {link.thumbnail_url ? <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl"><Image src={link.thumbnail_url} alt={link.title} fill className="object-cover" unoptimized /></div> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl" style={{ background: `${primaryColor}14`, color: primaryColor }}><SocialIcon name={link.icon} size={18} /></div>}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{link.title}</p>
                        {link.badge && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>{link.badge}</span>}
                      </div>
                      {link.description && <p className="text-xs mt-1" style={{ color: textSecondary }}>{link.description}</p>}
                      <p className="text-[10px] mt-2 uppercase tracking-[0.18em]" style={{ color: textSecondary }}>{link.clicks > 0 ? `${link.clicks} clicks` : 'listo para visitar'}</p>
                    </div>
                    <span className="self-center opacity-30 group-hover:opacity-60">→</span>
                  </div>
                </a>
              ))}
            </section>
          ))}

          <p className="text-xs mt-2 transition-colors duration-300" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26,10,46,0.2)' }}>luprintech</p>
        </div>
      </main>
    </>
  );
}

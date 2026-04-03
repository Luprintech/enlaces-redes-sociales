import { auth } from '@/lib/auth';
import LoginForm from './LoginForm';
import CmsPanel from './CmsPanel';
import { getDb } from '@/lib/db';

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

export const dynamic = 'force-dynamic';

export default async function RedesPage() {
  const session = await auth();

  if (!session) {
    return <LoginForm />;
  }

  const db = getDb();
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get() as Profile;
  const links = db
    .prepare('SELECT * FROM links ORDER BY sort_order ASC, id ASC')
    .all() as LinkItem[];

  return <CmsPanel profile={profile} links={links} />;
}

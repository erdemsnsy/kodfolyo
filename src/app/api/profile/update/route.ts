import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { upsertProfile, getProfileByUsername, updateRepoVisibility, updateFeaturedRepo, setProfilePublished, deleteProfile, setCustomDomain } from '../../../../lib/supabase/server';
import { CustomLink, ThemeType, ExperienceEntry, ManualProject, Certificate, SectionVisibility } from '../../../../types';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const sessionUsername = session?.user?.username;

    if (!sessionUsername) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı oturumu açılmamış.' },
        { status: 401 }
      );
    }

    // body.username istemciden geliyor; oturumdaki kullanıcıyla eşleşmiyorsa
    // isteği reddet — aksi halde herhangi biri başka bir kullanıcının
    // profilini (hesap silme dahil) düzenleyebilirdi.
    if (body.username && body.username !== sessionUsername) {
      return NextResponse.json(
        { success: false, error: 'Bu profili düzenleme yetkiniz yok.' },
        { status: 403 }
      );
    }

    const username = sessionUsername;

    const currentProfile = await getProfileByUsername(username);
    if (!currentProfile) {
      return NextResponse.json(
        { success: false, error: 'Profil bulunamadı.' },
        { status: 404 }
      );
    }

    // 1. Repo Görünürlüğü Güncelleme (Repo Toggle)
    if (typeof body.githubRepoId === 'number' && typeof body.isVisible === 'boolean') {
      await updateRepoVisibility(currentProfile, body.githubRepoId, body.isVisible);
      return NextResponse.json({ success: true, message: 'Repo görünürlüğü güncellendi.' });
    }

    // 1b. Vitrin (öne çıkan) repo seçimi
    if (typeof body.setFeaturedRepoId === 'number') {
      await updateFeaturedRepo(currentProfile, body.setFeaturedRepoId);
      return NextResponse.json({ success: true, message: 'Vitrin projesi güncellendi.' });
    }

    // 1c. Yayın durumu (yayından kaldır / tekrar yayınla)
    if (typeof body.isPublished === 'boolean') {
      await setProfilePublished(currentProfile, body.isPublished);
      return NextResponse.json({ success: true, message: body.isPublished ? 'Portfolyo tekrar yayında.' : 'Portfolyo yayından kaldırıldı.' });
    }

    // 1c-2. Özel alan adı ayarla (henüz doğrulanmamış olarak kaydedilir)
    if (typeof body.customDomain !== 'undefined') {
      await setCustomDomain(currentProfile, body.customDomain);
      const updatedProfile = await getProfileByUsername(username);
      return NextResponse.json({ success: true, profile: updatedProfile, message: 'Alan adı kaydedildi. Şimdi DNS kaydını doğrula.' });
    }

    // 1d. Hesabı kalıcı olarak sil (geri alınamaz)
    if (body.deleteAccount === true) {
      await deleteProfile(currentProfile);
      return NextResponse.json({ success: true, message: 'Hesap silindi.' });
    }

    // 2. Profil Ayarları Güncelleme (Bio, Tema, Özel Bağlantılar, İletişim Bilgileri)
    const customBio: string | null = typeof body.custom_bio !== 'undefined' ? body.custom_bio : currentProfile.custom_bio;
    const theme: ThemeType = body.theme || currentProfile.theme;
    const customLinks: CustomLink[] = body.custom_links || currentProfile.custom_links;
    const experience: ExperienceEntry[] = body.experience || currentProfile.experience;
    const manualProjects: ManualProject[] = body.manual_projects || currentProfile.manual_projects;
    const certificates: Certificate[] = body.certificates || currentProfile.certificates;
    const sectionVisibility: SectionVisibility = body.section_visibility || currentProfile.section_visibility;
    const name: string | null = typeof body.name !== 'undefined' ? body.name : currentProfile.name;
    const company: string | null = typeof body.company !== 'undefined' ? body.company : currentProfile.company;
    const location: string | null = typeof body.location !== 'undefined' ? body.location : currentProfile.location;
    const blog: string | null = typeof body.blog !== 'undefined' ? body.blog : currentProfile.blog;
    const rssUrl: string | null = typeof body.rss_url !== 'undefined' ? body.rss_url : (currentProfile.rss_url ?? null);
    const seoTitle: string | null = typeof body.seo_title !== 'undefined' ? body.seo_title : (currentProfile.seo_title ?? null);
    const seoDescription: string | null = typeof body.seo_description !== 'undefined' ? body.seo_description : (currentProfile.seo_description ?? null);

    const updated = await upsertProfile({
      github_id: currentProfile.github_id,
      username: currentProfile.username,
      name,
      avatar_url: currentProfile.avatar_url,
      bio: currentProfile.bio,
      custom_bio: customBio,
      company,
      location,
      email: currentProfile.email,
      blog,
      theme,
      custom_links: customLinks,
      experience,
      manual_projects: manualProjects,
      certificates,
      section_visibility: sectionVisibility,
      rss_url: rssUrl,
      seo_title: seoTitle,
      seo_description: seoDescription,
    });

    return NextResponse.json({
      success: true,
      profile: updated,
      message: 'Profil ayarları başarıyla kaydedildi.',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Profil güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

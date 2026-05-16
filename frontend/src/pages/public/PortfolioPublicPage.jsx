import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { buildPortfolioData } from "../../utils/portfolioDataMapper";

import DeveloperSparkTemplate from "../../components/portfolio-templates/DeveloperSparkTemplate";
import CreativeEditorialTemplate from "../../components/portfolio-templates/CreativeEditorialTemplate";
import MinimalProfessionalTemplate from "../../components/portfolio-templates/MinimalProfessionalTemplate";

const firstValue = (...values) => {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
};

const normalizePublicPortfolioOrder = (payload = {}) => {
  const hero = payload.hero || {};
  const biodata = payload.biodata || {};
  const contact = payload.contact || {};
  const meta = payload.meta || {};
  const orderInfo = payload.order_info || payload.orderInfo || {};
  const template = payload.template || {};
  const link =
    payload.portfolio_link || payload.portfolioLink || payload.link || null;

  const profile = payload.portfolio_profile || payload.portfolioProfile || {};

  return {
    id: firstValue(payload.id, payload.order_id, orderInfo.id, link?.order_id),

    kode_order: firstValue(
      payload.kode_order,
      payload.kodeOrder,
      orderInfo.kode_order,
      orderInfo.kodeOrder,
    ),

    paket: firstValue(
      orderInfo.paket,
      payload.paket,
      meta.paket,
      link?.order?.paket,
      "basic",
    ),

    template_id: firstValue(
      orderInfo.template_id,
      orderInfo.templateId,
      payload.template_id,
      payload.templateId,
      template.id,
      meta.template_id,
      meta.templateId,
      link?.order?.template_id,
      1,
    ),

    template: {
      ...template,
      id: firstValue(
        template.id,
        orderInfo.template_id,
        orderInfo.templateId,
        payload.template_id,
        payload.templateId,
        meta.template_id,
        meta.templateId,
        1,
      ),
      nama_template: firstValue(
        template.nama_template,
        template.name,
        meta.template_name,
        meta.templateName,
        "Portfolio Template",
      ),
      kategori: firstValue(
        template.kategori,
        template.category,
        meta.category,
        "Portfolio",
      ),
    },

    user: {
      name: firstValue(
        biodata.nama_lengkap,
        hero.nama_lengkap,
        profile.nama_lengkap,
        biodata.name,
        hero.name,
        meta.title,
        "Nama Portfolio",
      ),
      email: firstValue(contact.email, biodata.email, profile.email, ""),
    },

    portfolio_profile: {
      nama_lengkap: firstValue(
        biodata.nama_lengkap,
        hero.nama_lengkap,
        profile.nama_lengkap,
        biodata.name,
        hero.name,
        "",
      ),

      profesi: firstValue(
        biodata.profesi,
        hero.profesi,
        profile.profesi,
        biodata.profession,
        hero.profession,
        "",
      ),

      email: firstValue(contact.email, biodata.email, profile.email, ""),

      nomor_hp: firstValue(
        contact.nomor_hp,
        contact.phone,
        biodata.nomor_hp,
        biodata.phone,
        profile.nomor_hp,
        profile.phone,
        "",
      ),

      instagram: firstValue(
        contact.instagram,
        biodata.instagram,
        profile.instagram,
        "",
      ),

      linkedin: firstValue(
        contact.linkedin,
        biodata.linkedin,
        profile.linkedin,
        "",
      ),

      github: firstValue(contact.github, biodata.github, profile.github, ""),

      website: firstValue(
        contact.website,
        biodata.website,
        profile.website,
        "",
      ),

      about_me: firstValue(
        payload.about_me,
        hero.about_me,
        hero.about,
        biodata.about_me,
        biodata.about,
        profile.about_me,
        profile.about,
        meta.description,
        "",
      ),

      foto_profil: firstValue(
        hero.foto_profil,
        hero.foto,
        hero.photo,
        hero.profile_photo,
        hero.profile_photo_url,
        hero.photo_url,
        hero.image,

        biodata.foto_profil,
        biodata.foto,
        biodata.photo,
        biodata.profile_photo,
        biodata.profile_photo_url,
        biodata.photo_url,
        biodata.image,

        profile.foto_profil,
        profile.foto,
        profile.photo,
        profile.profile_photo,
        profile.profile_photo_url,
        profile.photo_url,
        profile.image,
        "",
      ),

      photo: firstValue(
        hero.photo,
        hero.foto,
        biodata.photo,
        biodata.foto,
        profile.photo,
        profile.foto,
        "",
      ),

      foto: firstValue(
        hero.foto,
        hero.photo,
        biodata.foto,
        biodata.photo,
        profile.foto,
        profile.photo,
        "",
      ),
    },

    skills:
      payload.skills ||
      payload.portfolio_skills ||
      payload.portfolioSkills ||
      [],

    tools:
      payload.tools || payload.portfolio_tools || payload.portfolioTools || [],

    projects:
      payload.projects ||
      payload.portfolio_projects ||
      payload.portfolioProjects ||
      [],

    educations:
      payload.educations ||
      payload.portfolio_educations ||
      payload.portfolioEducations ||
      [],

    experiences:
      payload.experiences ||
      payload.portfolio_experiences ||
      payload.portfolioExperiences ||
      [],

    certificates:
      payload.certificates ||
      payload.portfolio_certificates ||
      payload.portfolioCertificates ||
      [],

    achievements:
      payload.achievements ||
      payload.portfolio_achievements ||
      payload.portfolioAchievements ||
      [],

    portfolio_link: link,
  };
};

const PortfolioPublicPage = () => {
  const { slug } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(`/portfolio/${slug}`);
      const payload = response.data?.data || response.data;

      const normalizedOrder = normalizePublicPortfolioOrder(payload);

      setOrder(normalizedOrder);
      setMessage(response.data?.message || "");
    } catch (error) {
      setOrder(null);
      setMessage(error.response?.data?.message || "Portfolio tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const finalData = useMemo(() => {
    if (!order) return null;
    return buildPortfolioData(order);
  }, [order]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050609] px-4 py-10 text-white">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#111827] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="h-4 w-36 animate-pulse rounded-full bg-white/10" />
            <div className="mt-5 h-14 w-full max-w-xl animate-pulse rounded-2xl bg-white/10" />
            <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-full bg-white/10" />
            <div className="mt-8 h-[520px] animate-pulse rounded-[28px] bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  if (!order || !finalData) {
    return (
      <main className="min-h-screen bg-[#050609] px-4 py-10 text-white">
        <section className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[34px] border border-red-400/20 bg-red-400/10 p-7 text-red-100 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em]">
            Portfolio Tidak Ditemukan
          </p>

          <h1 className="mt-4 max-w-3xl text-[clamp(34px,5vw,64px)] font-black leading-none tracking-[-0.06em]">
            Link portfolio belum aktif atau tidak tersedia.
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-red-100/85">
            {message ||
              "Pastikan link portfolio benar dan order sudah diselesaikan oleh admin."}
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 font-black text-white transition hover:bg-white/15"
          >
            Kembali ke Beranda
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050609] py-10">
      <PortfolioTemplate data={finalData} />

      <section className="mx-auto -mt-16 flex w-full max-w-[1180px] justify-end px-6 pb-8 md:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-black text-[#111827] shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white/90"
        >
          <span>Made with Build Portfolio</span>
          <span>→</span>
        </Link>
      </section>
    </main>
  );
};

const PortfolioTemplate = ({ data }) => {
  const templateNumber = Number(data.templateId || 1);

  if (templateNumber === 1) {
    return <DeveloperSparkTemplate data={data} />;
  }

  if (templateNumber === 2) {
    return <CreativeEditorialTemplate data={data} />;
  }

  if (templateNumber === 3) {
    return <MinimalProfessionalTemplate data={data} />;
  }

  return <DeveloperSparkTemplate data={data} />;
};

export default PortfolioPublicPage;
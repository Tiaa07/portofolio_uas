import { getTemplateDummyData } from "../data/templateDummyData";

const firstValue = (...values) => {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
};

const getProfile = (order) => {
  return order?.portfolio_profile || order?.portfolioProfile || {};
};

const normalizePackage = (paket) => {
  const value = String(paket || "basic")
    .toLowerCase()
    .trim();

  if (value === "standar") return "standard";
  if (value === "standard") return "standard";
  if (value === "premium") return "premium";
  return "basic";
};

const normalizeTemplateId = (order) => {
  const rawId = firstValue(
    order?.template_id,
    order?.templateId,
    order?.template?.id,
    order?.template?.template_id,
    1,
  );

  const numberId = Number(rawId);

  return Number.isNaN(numberId) ? 1 : numberId;
};

const normalizeArrayValue = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const levelToPercent = (level) => {
  const normalized = String(level || "").toLowerCase();

  if (normalized.includes("pemula")) return 45;
  if (normalized.includes("menengah")) return 65;
  if (normalized.includes("mahir")) return 85;
  if (normalized.includes("expert")) return 95;

  return 80;
};

const normalizeSkills = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          level: "Mahir",
          percent: 80,
        };
      }

      const name = firstValue(
        item.nama_skill,
        item.skill,
        item.name,
        item.nama,
        "",
      );

      const level = firstValue(
        item.level_skill,
        item.tingkat_skill,
        item.level,
        item.tingkat,
        "Mahir",
      );

      const rawPercent = firstValue(
        item.persentase_skill,
        item.persentase,
        item.percent,
        item.percentage,
        null,
      );

      const percent =
        rawPercent !== null && rawPercent !== ""
          ? Number(rawPercent)
          : levelToPercent(level);

      return {
        name,
        level,
        percent: Number.isNaN(percent) ? levelToPercent(level) : percent,
      };
    })
    .filter((item) => item.name);
};

const normalizeTools = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") return item;

      return firstValue(
        item.nama_tools,
        item.nama_tool,
        item.tool,
        item.name,
        item.nama,
        "",
      );
    })
    .filter(Boolean);
};

const normalizeProjects = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const title = firstValue(
        item.nama_project,
        item.nama_proyek,
        item.title,
        item.name,
        "Project",
      );

      const image = firstValue(
        item.gambar_project,
        item.gambar_project_url,
        item.project_image,
        item.project_image_url,
        item.gambar,
        item.image,
        item.image_url,
        null,
      );

      return {
        title,
        category: firstValue(
          item.kategori_project,
          item.kategori,
          item.category,
          "Website Project",
        ),
        description: firstValue(
          item.deskripsi_project,
          item.deskripsi,
          item.description,
          "-",
        ),
        link: firstValue(item.link_project, item.link, item.url, "#"),
        image: image ? storageUrl(image) : null,
        imageLabel: title?.slice(0, 2).toUpperCase() || "PR",
        tech: normalizeArrayValue(
          firstValue(item.tech, item.teknologi, item.tools, null),
        ).length
          ? normalizeArrayValue(firstValue(item.tech, item.teknologi, item.tools))
          : ["Website", "Frontend", "UI"],
      };
    })
    .filter((item) => item.title);
};

const normalizeEducations = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      title: firstValue(
        item.nama_sekolah,
        item.nama_kampus,
        item.sekolah,
        item.school,
        item.title,
        "Pendidikan",
      ),
      subtitle: [
        firstValue(item.jurusan, item.program_studi, ""),
        firstValue(item.tahun_mulai, ""),
        firstValue(item.tahun_selesai, ""),
      ]
        .filter(Boolean)
        .join(" • "),
      description: firstValue(item.deskripsi, item.description, ""),
    }))
    .filter((item) => item.title);
};

const normalizeExperiences = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      title: firstValue(
        item.posisi,
        item.jabatan,
        item.position,
        item.title,
        "Pengalaman",
      ),
      subtitle: [
        firstValue(item.nama_tempat, item.perusahaan, item.company, ""),
        firstValue(item.tahun_mulai, ""),
        firstValue(item.tahun_selesai, ""),
      ]
        .filter(Boolean)
        .join(" • "),
      description: firstValue(item.deskripsi, item.description, ""),
    }))
    .filter((item) => item.title);
};

const normalizeCertificates = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      title: firstValue(
        item.nama_sertifikat,
        item.sertifikat,
        item.name,
        item.title,
        "Sertifikat",
      ),
      subtitle: [
        firstValue(item.penerbit, item.issuer, ""),
        firstValue(item.tahun, ""),
      ]
        .filter(Boolean)
        .join(" • "),
      description: firstValue(item.deskripsi, item.description, ""),
      file: storageUrl(
        firstValue(
          item.file_sertifikat,
          item.sertifikat_file,
          item.file_certificate,
          item.certificate_file,
          item.file_path,
          item.file,
          null,
      ),
      ),
    }))
    .filter((item) => item.title);
};

const normalizeAchievements = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      title: firstValue(
        item.nama_pencapaian,
        item.pencapaian,
        item.name,
        item.title,
        "Pencapaian",
      ),
      subtitle: [
        firstValue(item.deskripsi, item.description, ""),
        firstValue(item.tahun, ""),
      ]
        .filter(Boolean)
        .join(" • "),
      description: firstValue(item.deskripsi, item.description, ""),
    }))
    .filter((item) => item.title);
};

export const storageUrl = (path) => {
  if (!path) return null;

  const value = String(path).trim();

  if (!value) return null;

  if (value.startsWith("data:")) return value;
  if (value.startsWith("blob:")) return value;

  let cleaned = value.replace(/\\/g, "/");

  const storageMarkers = [
    "/storage/app/public/",
    "storage/app/public/",
    "/app/public/",
    "app/public/",
    "/public/storage/",
    "public/storage/",
    "/storage/",
    "storage/",
  ];

  if (cleaned.startsWith("http")) {
    try {
      const url = new URL(cleaned);
      const hasStoragePath = storageMarkers.some((marker) =>
        url.pathname.includes(marker),
      );

      if (!hasStoragePath) return cleaned;

      cleaned = url.pathname;
    } catch {
      return cleaned;
    }
  }

  for (const marker of storageMarkers) {
    const markerIndex = cleaned.indexOf(marker);

    if (markerIndex !== -1) {
      cleaned = cleaned.slice(markerIndex + marker.length);
      break;
    }
  }

  cleaned = cleaned
    .replace(/^\/+/, "")
    .replace(/^public\/storage\//, "")
    .replace(/^storage\/app\/public\//, "")
    .replace(/^app\/public\//, "")
    .replace(/^storage\//, "")
    .replace(/^public\//, "");

  if (!cleaned) return null;

  return `/media/${cleaned}`;
};

export const buildPortfolioData = (order) => {
  const profile = getProfile(order);

  const paket = normalizePackage(
    firstValue(order?.paket, order?.order_info?.paket, order?.orderInfo?.paket),
  );

  const templateId = normalizeTemplateId(order);
  const dummy = getTemplateDummyData(templateId);

  const userSkills = normalizeSkills(
    firstValue(order?.skills, order?.portfolio_skills, order?.portfolioSkills, []),
  );

  const userTools = normalizeTools(
    firstValue(order?.tools, order?.portfolio_tools, order?.portfolioTools, []),
  );

  const userProjects = normalizeProjects(
    firstValue(
      order?.projects,
      order?.portfolio_projects,
      order?.portfolioProjects,
      [],
    ),
  );

  const userEducations = normalizeEducations(
    firstValue(
      order?.educations,
      order?.portfolio_educations,
      order?.portfolioEducations,
      [],
    ),
  );

  const userExperiences = normalizeExperiences(
    firstValue(
      order?.experiences,
      order?.portfolio_experiences,
      order?.portfolioExperiences,
      [],
    ),
  );

  const userCertificates = normalizeCertificates(
    firstValue(
      order?.certificates,
      order?.portfolio_certificates,
      order?.portfolioCertificates,
      [],
    ),
  );

  const userAchievements = normalizeAchievements(
    firstValue(
      order?.achievements,
      order?.portfolio_achievements,
      order?.portfolioAchievements,
      [],
    ),
  );

  const photo = firstValue(
    profile.foto_profil,
    profile.foto_profil_url,
    profile.photo,
    profile.photo_url,
    profile.profile_photo,
    profile.profile_photo_url,
    profile.foto,
    profile.image,
    profile.image_url,
    null,
  );

  const baseData = {
    orderId: order?.id,
    kodeOrder: order?.kode_order || order?.kodeOrder || `ORDER-${order?.id}`,

    paket,
    templateId,

    templateName: firstValue(
      order?.template?.nama_template,
      order?.template?.name,
      order?.template_name,
      order?.templateName,
      "Portfolio Template",
    ),

    templateCategory: firstValue(
      order?.template?.kategori,
      order?.template?.category,
      order?.kategori,
      "Portfolio",
    ),

    name: firstValue(
      profile.nama_lengkap,
      profile.name,
      order?.user?.name,
      "Nama Portfolio",
    ),

    profession: firstValue(
      profile.profesi,
      profile.profession,
      "Professional",
    ),

    email: firstValue(
      profile.email,
      order?.user?.email,
      "email@example.com",
    ),

    phone: firstValue(
      profile.nomor_hp,
      profile.no_hp,
      profile.phone,
      profile.whatsapp,
      "081234567890",
    ),

    instagram: firstValue(profile.instagram, "@username"),
    linkedin: firstValue(profile.linkedin, "linkedin.com/in/username"),
    github: firstValue(profile.github, "github.com/username"),
    website: firstValue(profile.website, "website.com"),

    photo: storageUrl(photo),
  };

  if (paket === "basic") {
    return {
      ...baseData,

      about: dummy.about,
      skills: dummy.skills,
      tools: dummy.tools,
      projects: dummy.projects,
      educations: dummy.educations,
      experiences: dummy.experiences,
      certificates: dummy.certificates,
      achievements: dummy.achievements,
    };
  }

  if (paket === "standard") {
    return {
      ...baseData,

      about: firstValue(profile.about_me, profile.about, dummy.about),

      skills: userSkills.length ? userSkills : dummy.skills,
      tools: userTools.length ? userTools : dummy.tools,

      projects: dummy.projects,
      educations: dummy.educations,
      experiences: dummy.experiences,
      certificates: dummy.certificates,
      achievements: dummy.achievements,
    };
  }

  if (paket === "premium") {
    return {
      ...baseData,

      about: firstValue(profile.about_me, profile.about, dummy.about),

      skills: userSkills.length ? userSkills : dummy.skills,
      tools: userTools.length ? userTools : dummy.tools,
      projects: userProjects.length ? userProjects : dummy.projects,
      educations: userEducations.length ? userEducations : dummy.educations,
      experiences: userExperiences.length
        ? userExperiences
        : dummy.experiences,
      certificates: userCertificates.length
        ? userCertificates
        : dummy.certificates,
      achievements: userAchievements.length
        ? userAchievements
        : dummy.achievements,
    };
  }

  return {
    ...baseData,
    about: dummy.about,
    skills: dummy.skills,
    tools: dummy.tools,
    projects: dummy.projects,
    educations: dummy.educations,
    experiences: dummy.experiences,
    certificates: dummy.certificates,
    achievements: dummy.achievements,
  };
};

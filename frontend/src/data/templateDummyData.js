import developerProject1 from "../assets/project-dummies/developer/project-1.png";
import developerProject2 from "../assets/project-dummies/developer/project-2.png";
import developerProject3 from "../assets/project-dummies/developer/project-3.png";

import creativeProject1 from "../assets/project-dummies/creative/project-1.png";
import creativeProject2 from "../assets/project-dummies/creative/project-2.png";
import creativeProject3 from "../assets/project-dummies/creative/project-3.png";

import minimalProject1 from "../assets/project-dummies/minimal/project-1.png";
import minimalProject2 from "../assets/project-dummies/minimal/project-2.png";
import minimalProject3 from "../assets/project-dummies/minimal/project-3.png";

export const developerDummyData = {
  about:
    "Saya berfokus pada pengembangan website modern yang rapi, responsif, dan mudah digunakan. Saya terbiasa membangun antarmuka, menghubungkan API, serta menyusun struktur aplikasi yang jelas.",

  skills: [
    {
      name: "HTML & CSS",
      level: "Mahir",
      percent: 90,
    },
    {
      name: "JavaScript",
      level: "Mahir",
      percent: 85,
    },
    {
      name: "React",
      level: "Menengah",
      percent: 75,
    },
    {
      name: "Laravel",
      level: "Menengah",
      percent: 70,
    },
  ],

  tools: ["VS Code", "GitHub", "Postman", "pgAdmin", "Figma"],

  projects: [
    {
      title: "Website Portfolio Personal",
      category: "Frontend Website",
      description:
        "Website portfolio modern untuk menampilkan profil, keahlian, project, dan kontak profesional secara rapi.",
      image: developerProject1,
      imageLabel: "WP",
      tech: ["React", "Tailwind", "Responsive UI"],
      link: "#",
    },
    {
      title: "Sistem Manajemen Pesanan",
      category: "Web Application",
      description:
        "Aplikasi untuk mengelola pesanan user, status pembayaran, verifikasi admin, dan alur pengerjaan project.",
      image: developerProject2,
      imageLabel: "SM",
      tech: ["Laravel", "React", "REST API"],
      link: "#",
    },
    {
      title: "Dashboard Monitoring",
      category: "Dashboard",
      description:
        "Dashboard admin untuk menampilkan ringkasan data, aktivitas pengguna, dan informasi utama secara terstruktur.",
      image: developerProject3,
      imageLabel: "DM",
      tech: ["React", "Tailwind", "API"],
      link: "#",
    },
  ],

  educations: [
    {
      title: "Program Studi Teknologi Informasi",
      subtitle: "Pengembangan Web dan Sistem Informasi",
      description:
        "Mempelajari dasar pemrograman, pengembangan website, database, dan sistem informasi.",
    },
  ],

  experiences: [
    {
      title: "Frontend Developer",
      subtitle: "Membangun website modern dan responsif.",
      description:
        "Berfokus pada pembuatan antarmuka, integrasi API, dan pengalaman pengguna yang nyaman.",
    },
  ],

  certificates: [
    {
      title: "Sertifikat Web Development",
      subtitle: "Dasar pengembangan website modern.",
      file: null,
    },
  ],

  achievements: [
    {
      title: "Portfolio Digital Showcase",
      subtitle: "Menampilkan karya dan profil profesional secara online.",
    },
  ],
};

export const creativeDummyData = {
  about:
  "Saya berfokus pada pengembangan identitas visual, desain konten, dan visual storytelling. Setiap karya saya dirancang untuk menghadirkan komunikasi yang kuat, tampilan yang terarah, serta karakter visual yang relevan dengan kebutuhan brand maupun personal portfolio.",

  skills: [
    {
      name: "Graphic Design",
      level: "Mahir",
      percent: 90,
    },
    {
      name: "Brand Identity",
      level: "Mahir",
      percent: 85,
    },
    {
      name: "Content Design",
      level: "Menengah",
      percent: 78,
    },
    {
      name: "Editorial Layout",
      level: "Menengah",
      percent: 75,
    },
  ],

  tools: ["Figma", "Canva", "Photoshop", "Illustrator", "CapCut"],

  projects: [
  {
    title: "Brand Campaign Visual",
    category: "Branding",
    description:
      "Konsep visual kampanye yang dirancang untuk memperkuat identitas brand melalui komposisi, warna, dan tipografi yang konsisten.",
    image: creativeProject1,
    imageLabel: "BC",
    tech: ["Branding", "Campaign", "Visual Design"],
    link: "#",
  },
  {
    title: "Social Media Content Kit",
    category: "Content Design",
    description:
      "Serangkaian aset visual untuk kebutuhan media sosial, mencakup template feed, story, dan materi promosi digital.",
    image: creativeProject2,
    imageLabel: "SM",
    tech: ["Content Design", "Layout", "Canva"],
    link: "#",
  },
  {
    title: "Editorial Portfolio Layout",
    category: "Editorial",
    description:
      "Tata letak portfolio visual dengan pendekatan editorial yang menonjolkan hirarki informasi, komposisi, dan karakter desain yang kuat.",
    image: creativeProject3,
    imageLabel: "EP",
    tech: ["Editorial", "Typography", "Creative Direction"],
    link: "#",
  },
],

  educations: [
    {
      title: "Program Desain Komunikasi Visual",
      subtitle: "Visual Branding dan Media Digital",
      description:
        "Mempelajari desain visual, warna, tipografi, komposisi, dan strategi komunikasi kreatif.",
    },
  ],

  experiences: [
    {
      title: "Creative Designer",
      subtitle: "Membuat konten visual dan identitas digital.",
      description:
        "Berfokus pada desain konten, campaign visual, dan kebutuhan branding untuk media digital.",
    },
  ],

  certificates: [
    {
      title: "Sertifikat Graphic Design",
      subtitle: "Desain visual dan digital branding.",
      file: null,
    },
  ],

  achievements: [
    {
      title: "Creative Portfolio Showcase",
      subtitle: "Karya visual terpilih untuk kebutuhan digital portfolio.",
    },
  ],
};

export const minimalDummyData = {
  about:
  "Saya memiliki ketertarikan pada pengembangan diri, kerja tim, dan penyelesaian tugas secara terstruktur. Dalam setiap proses, saya berusaha menjaga komunikasi yang baik, memahami kebutuhan dengan teliti, dan memberikan hasil yang dapat dipertanggungjawabkan.",

  skills: [
    {
      name: "Communication",
      level: "Mahir",
      percent: 88,
    },
    {
      name: "Teamwork",
      level: "Mahir",
      percent: 86,
    },
    {
      name: "Problem Solving",
      level: "Menengah",
      percent: 78,
    },
    {
      name: "Time Management",
      level: "Menengah",
      percent: 75,
    },
  ],

  tools: ["Microsoft Office", "Google Workspace", "Notion", "Canva", "LinkedIn"],

  projects: [
    {
      title: "Digital CV Profile",
      category: "Personal Branding",
      description:
        "Profil digital profesional yang merangkum identitas, pengalaman, kemampuan, dan kontak dalam tampilan yang bersih.",
      image: minimalProject1,
      imageLabel: "CV",
      tech: ["Personal Branding", "Profile", "Career"],
      link: "#",
    },
    {
      title: "Organization Profile",
      category: "Presentation",
      description:
        "Halaman profil organisasi yang menampilkan informasi, struktur, kegiatan, dan nilai utama secara profesional.",
      image: minimalProject2,
      imageLabel: "OP",
      tech: ["Presentation", "Content", "Layout"],
      link: "#",
    },
    {
      title: "Academic Project Summary",
      category: "Academic",
      description:
        "Ringkasan project akademik yang disusun dengan tampilan rapi, mudah dibaca, dan sesuai kebutuhan presentasi.",
      image: minimalProject3,
      imageLabel: "AP",
      tech: ["Research", "Writing", "Documentation"],
      link: "#",
    },
  ],

  educations: [
    {
      title: "Pendidikan Formal",
      subtitle: "Pengembangan akademik dan profesional",
      description:
        "Membangun dasar pengetahuan, kedisiplinan, komunikasi, dan kemampuan menyelesaikan tugas.",
    },
  ],

  experiences: [
    {
      title: "Pengalaman Organisasi",
      subtitle: "Kerja tim dan tanggung jawab",
      description:
        "Terlibat dalam kegiatan yang melatih komunikasi, kepemimpinan, koordinasi, dan manajemen waktu.",
    },
  ],

  certificates: [
    {
      title: "Sertifikat Pengembangan Diri",
      subtitle: "Komunikasi, organisasi, dan profesionalisme.",
      file: null,
    },
  ],

  achievements: [
    {
      title: "Personal Branding Portfolio",
      subtitle: "Profil profesional yang siap digunakan untuk peluang karier.",
    },
  ],
};

export const getTemplateDummyData = (templateId) => {
  const id = Number(templateId || 1);

  if (id === 1) {
    return developerDummyData;
  }

  if (id === 2) {
    return creativeDummyData;
  }

  if (id === 3) {
    return minimalDummyData;
  }

  return developerDummyData;
};
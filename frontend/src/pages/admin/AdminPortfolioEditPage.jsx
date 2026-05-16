import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { storageUrl as resolveStorageUrl } from "../../utils/portfolioDataMapper";
import { formatValidationMessage } from "../../utils/validationFormatter";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/sweetAlert";

const initialProfile = {
  nama_lengkap: "",
  profesi: "",
  email: "",
  nomor_hp: "",
  instagram: "",
  linkedin: "",
  github: "",
  website: "",
  about_me: "",
  foto_profil: "",
};

const AdminPortfolioEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [profile, setProfile] = useState(initialProfile);

  const [skills, setSkills] = useState([
    { nama_skill: "", level_skill: "Mahir" },
  ]);

  const [tools, setTools] = useState([{ nama_tools: "" }]);

  const [projects, setProjects] = useState([
    {
      id: null,
      nama_project: "",
      deskripsi_project: "",
      link_project: "",
      gambar_project: "",
    },
  ]);

  const [educations, setEducations] = useState([
    {
      nama_sekolah: "",
      jurusan: "",
      tahun_mulai: "",
      tahun_selesai: "",
      deskripsi: "",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      nama_tempat: "",
      posisi: "",
      tahun_mulai: "",
      tahun_selesai: "",
      deskripsi: "",
    },
  ]);

  const [certificates, setCertificates] = useState([
    {
      id: null,
      nama_sertifikat: "",
      penerbit: "",
      tahun: "",
      file_sertifikat: "",
    },
  ]);

  const [achievements, setAchievements] = useState([
    { nama_pencapaian: "", deskripsi: "", tahun: "" },
  ]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.get(`/admin/orders/${id}`);
      const data = response.data?.data || response.data;

      setOrder(data);

      const portfolioProfile =
        data.portfolio_profile || data.portfolioProfile || {};

      setProfile({
        nama_lengkap: portfolioProfile.nama_lengkap || "",
        profesi: portfolioProfile.profesi || "",
        email: portfolioProfile.email || "",
        nomor_hp: portfolioProfile.nomor_hp || "",
        instagram: portfolioProfile.instagram || "",
        linkedin: portfolioProfile.linkedin || "",
        github: portfolioProfile.github || "",
        website: portfolioProfile.website || "",
        about_me: portfolioProfile.about_me || portfolioProfile.about || "",
        foto_profil:
          portfolioProfile.foto_profil ||
          portfolioProfile.photo ||
          portfolioProfile.profile_photo ||
          portfolioProfile.foto ||
          "",
      });

      setSkills(
        data.skills?.length
          ? data.skills.map((item) => ({
              nama_skill:
                item.nama_skill || item.skill || item.name || item.nama || "",
              level_skill:
                item.level_skill ||
                item.tingkat_skill ||
                item.level ||
                item.tingkat ||
                "Mahir",
            }))
          : [{ nama_skill: "", level_skill: "Mahir" }]
      );

      setTools(
        data.tools?.length
          ? data.tools.map((item) => ({
              nama_tools:
                item.nama_tools ||
                item.nama_tool ||
                item.tool ||
                item.name ||
                item.nama ||
                "",
            }))
          : [{ nama_tools: "" }]
      );

      setProjects(
        data.projects?.length
          ? data.projects.map((item) => ({
              id: item.id || null,
              nama_project:
                item.nama_project ||
                item.nama_proyek ||
                item.title ||
                item.name ||
                "",
              deskripsi_project:
                item.deskripsi_project ||
                item.deskripsi ||
                item.description ||
                "",
              link_project: item.link_project || item.link || item.url || "",
              gambar_project:
                item.gambar_project ||
                item.gambar ||
                item.image ||
                item.project_image ||
                item.gambar_project_file ||
                "",
            }))
          : [
              {
                id: null,
                nama_project: "",
                deskripsi_project: "",
                link_project: "",
                gambar_project: "",
              },
            ]
      );

      setEducations(
        data.educations?.length
          ? data.educations.map((item) => ({
              nama_sekolah:
                item.nama_sekolah ||
                item.nama_kampus ||
                item.sekolah ||
                item.school ||
                item.title ||
                "",
              jurusan: item.jurusan || item.program_studi || "",
              tahun_mulai: item.tahun_mulai || "",
              tahun_selesai: item.tahun_selesai || "",
              deskripsi: item.deskripsi || item.description || "",
            }))
          : [
              {
                nama_sekolah: "",
                jurusan: "",
                tahun_mulai: "",
                tahun_selesai: "",
                deskripsi: "",
              },
            ]
      );

      setExperiences(
        data.experiences?.length
          ? data.experiences.map((item) => ({
              nama_tempat:
                item.nama_tempat ||
                item.perusahaan ||
                item.company ||
                item.tempat ||
                "",
              posisi:
                item.posisi ||
                item.jabatan ||
                item.position ||
                item.title ||
                "",
              tahun_mulai: item.tahun_mulai || "",
              tahun_selesai: item.tahun_selesai || "",
              deskripsi: item.deskripsi || item.description || "",
            }))
          : [
              {
                nama_tempat: "",
                posisi: "",
                tahun_mulai: "",
                tahun_selesai: "",
                deskripsi: "",
              },
            ]
      );

      setCertificates(
        data.certificates?.length
          ? data.certificates.map((item) => ({
              id: item.id || null,
              nama_sertifikat:
                item.nama_sertifikat ||
                item.sertifikat ||
                item.name ||
                item.title ||
                "",
              penerbit: item.penerbit || item.issuer || "",
              tahun: item.tahun || "",
              file_sertifikat:
                item.file_sertifikat ||
                item.sertifikat_file ||
                item.file_certificate ||
                item.certificate_file ||
                item.file_path ||
                item.file ||
                "",
            }))
          : [
              {
                id: null,
                nama_sertifikat: "",
                penerbit: "",
                tahun: "",
                file_sertifikat: "",
              },
            ]
      );

      setAchievements(
        data.achievements?.length
          ? data.achievements.map((item) => ({
              nama_pencapaian:
                item.nama_pencapaian ||
                item.pencapaian ||
                item.name ||
                item.title ||
                "",
              deskripsi: item.deskripsi || item.description || "",
              tahun: item.tahun || "",
            }))
          : [{ nama_pencapaian: "", deskripsi: "", tahun: "" }]
      );
   } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Gagal mengambil detail order.";

    setMessage(errorMessage);
    await showErrorAlert("Gagal Memuat Data", errorMessage);
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const updateArrayItem = (setter, index, field, value) => {
    setter((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addArrayItem = (setter, emptyItem) => {
    setter((prev) => [...prev, emptyItem]);
  };

  const removeArrayItem = (setter, index) => {
    setter((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const cleanArray = (items, requiredKey) => {
    return items.filter((item) => String(item[requiredKey] || "").trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!order) return;

    const confirmSave = await showConfirmAlert({
      title: "Simpan data portfolio?",
      text: "Perubahan data portfolio akan disimpan. File lama seperti foto, gambar project, dan sertifikat tetap dipertahankan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmSave.isConfirmed) return;

    try {
      setSaving(true);
      setMessage("");
      setErrors({});

      const paket = normalizeText(order.paket);

      const stripLocalUrl = (value) => {
        if (!value) return value;
        const str = String(value);
        const parts = str.split("/storage/");
        if (parts.length > 1) return parts[1];
        return value;
      };

      const payload = {
        nama_lengkap: profile.nama_lengkap,
        profesi: profile.profesi,
        email: profile.email,
        nomor_hp: profile.nomor_hp,
        instagram: profile.instagram,
        linkedin: profile.linkedin,
        github: profile.github,
        website: profile.website,

        foto_profil: stripLocalUrl(profile.foto_profil),
        photo: stripLocalUrl(profile.foto_profil),
        profile_photo: stripLocalUrl(profile.foto_profil),
        foto: stripLocalUrl(profile.foto_profil),
      };

      if (paket === "standard" || paket === "standar" || paket === "premium") {
        payload.about_me = profile.about_me;
        payload.skills = cleanArray(skills, "nama_skill");
        payload.tools = cleanArray(tools, "nama_tools");
      }

      if (paket === "premium") {
        payload.projects = cleanArray(projects, "nama_project").map(
          (project) => ({
            id: project.id || null,
            nama_project: project.nama_project,
            deskripsi_project: project.deskripsi_project,
            link_project: project.link_project,

            gambar_project: stripLocalUrl(project.gambar_project || ""),
            gambar: stripLocalUrl(project.gambar_project || ""),
            image: stripLocalUrl(project.gambar_project || ""),
            project_image: stripLocalUrl(project.gambar_project || ""),
          })
        );

        payload.educations = cleanArray(educations, "nama_sekolah");
        payload.experiences = cleanArray(experiences, "nama_tempat");

        payload.certificates = cleanArray(
          certificates,
          "nama_sertifikat"
        ).map((certificate) => ({
          id: certificate.id || null,
          nama_sertifikat: certificate.nama_sertifikat,
          penerbit: certificate.penerbit,
          tahun: certificate.tahun,

          file_sertifikat: stripLocalUrl(certificate.file_sertifikat || ""),
          sertifikat_file: stripLocalUrl(certificate.file_sertifikat || ""),
          file_certificate: stripLocalUrl(certificate.file_sertifikat || ""),
          certificate_file: stripLocalUrl(certificate.file_sertifikat || ""),
          file_path: stripLocalUrl(certificate.file_sertifikat || ""),
          file: stripLocalUrl(certificate.file_sertifikat || ""),
        }));

        payload.achievements = cleanArray(achievements, "nama_pencapaian");
      }

      const response = await axiosInstance.put(
        `/admin/orders/${id}/portfolio-data`,
        payload
      );

      const successMessage =
        response.data?.message || "Data portfolio berhasil diperbarui.";

      setMessage(successMessage);

      await showSuccessAlert("Data Portfolio Tersimpan", successMessage);

      // Re-fetch data to get new IDs from backend after delete/recreate logic
      fetchOrder();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui data portfolio.";

      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});

      await showErrorAlert("Gagal Menyimpan", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[340px] animate-pulse rounded-[34px] bg-white shadow-sm" />
          <div className="mt-6 h-[620px] animate-pulse rounded-[34px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <section className="rounded-[30px] border border-red-200 bg-red-50 p-7 text-red-600 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em]">
              Edit Error
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              Order tidak ditemukan.
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7">
              {message || "Data order tidak tersedia."}
            </p>

            <Link
              to="/admin/orders"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-black text-white hover:bg-red-700"
            >
              Kembali ke Order Masuk
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const paymentStatus = normalizeStatus(
    order.status_pembayaran || order.payment?.status
  );
  const orderStatus = normalizeStatus(order.status_pesanan);

  const paket = normalizeText(order.paket);
  const isStandardOrPremium =
    paket === "standard" || paket === "standar" || paket === "premium";
  const isPremium = paket === "premium";

  const canEdit =
    (paymentStatus === "lunas" || paymentStatus === "paid") &&
    (orderStatus === "diproses" || orderStatus === "processing");

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[38px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Admin Portfolio Editor
              </p>

              <h1 className="mt-4 text-[clamp(36px,5vw,68px)] font-black leading-[1] tracking-[-0.06em]">
                Rapikan data portfolio.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Edit data portfolio user dengan form dinamis. Admin bisa
                menambah, menghapus, dan memperbaiki data tanpa format manual.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/admin/orders/${id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Kembali ke Detail
                </Link>

                <Link
                  to={`/admin/orders/${id}/preview-portfolio`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white transition hover:bg-[#1d4ed8]"
                >
                  Preview Portfolio
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroBox
                  label="Kode Order"
                  value={order.kode_order || `ORDER-${id}`}
                />
                <HeroBox label="Paket" value={formatPackage(order.paket)} />
                <HeroBox
                  label="Pembayaran"
                  value={formatStatus(paymentStatus)}
                />
                <HeroBox label="Pesanan" value={formatStatus(orderStatus)} />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold leading-7 text-[#2563eb]">
            <p>{message}</p>

            {Object.keys(errors).length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-red-600">
                {Object.entries(errors).map(([field, messages]) => (
                  <li key={field}>
                    {formatValidationMessage(field, messages)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!canEdit && (
          <div className="mt-6 rounded-[28px] border border-[#fed7aa] bg-[#fff7ed] p-5 text-[#f97316]">
            <p className="text-sm font-black uppercase tracking-[0.16em]">
              Editor Belum Aktif
            </p>

            <p className="mt-2 text-sm font-semibold leading-7">
              Data portfolio hanya bisa diedit jika pembayaran sudah{" "}
              <strong>lunas</strong> dan order berstatus{" "}
              <strong>diproses</strong>.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={paymentStatus}>
                Pembayaran: {formatStatus(paymentStatus)}
              </StatusBadge>

              <StatusBadge status={orderStatus}>
                Pesanan: {formatStatus(orderStatus)}
              </StatusBadge>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          <Card
            eyebrow="Basic Data"
            title="Data Utama"
            desc="Data ini tampil di bagian hero, profil utama, dan kontak dasar."
          >
            {profile.foto_profil && (
              <div className="rounded-[28px] border border-[#e5e7eb] bg-[#f8fafc] p-5">
                <p className="text-sm font-black text-[#111827]">
                  Foto Profil User
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="h-28 w-28 overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white p-1 shadow-sm">
                    <img
                      src={storageUrl(profile.foto_profil)}
                      alt="Foto Profil User"
                      className="h-full w-full rounded-[20px] object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-7 text-[#64748b]">
                      Foto ini berasal dari input user. Saat admin edit teks,
                      foto ini tetap dikirim ulang supaya tidak hilang.
                    </p>

                    <p className="mt-2 break-all text-xs font-bold text-[#94a3b8]">
                      {profile.foto_profil}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                name="nama_lengkap"
                value={profile.nama_lengkap}
                onChange={handleProfileChange}
                error={errors.nama_lengkap}
                placeholder="Contoh: Tiaa Anggraeni"
              />

              <Input
                label="Profesi"
                name="profesi"
                value={profile.profesi}
                onChange={handleProfileChange}
                error={errors.profesi}
                placeholder="Contoh: Frontend Developer"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                error={errors.email}
                placeholder="Contoh: email@example.com"
              />

              <Input
                label="Nomor HP"
                name="nomor_hp"
                value={profile.nomor_hp}
                onChange={handleProfileChange}
                error={errors.nomor_hp}
                placeholder="Contoh: 081234567890"
              />

              <Input
                label="Instagram"
                name="instagram"
                value={profile.instagram}
                onChange={handleProfileChange}
                error={errors.instagram}
                placeholder="Contoh: @username"
              />

              <Input
                label="LinkedIn"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleProfileChange}
                error={errors.linkedin}
                placeholder="Contoh: linkedin.com/in/username"
              />

              <Input
                label="GitHub"
                name="github"
                value={profile.github}
                onChange={handleProfileChange}
                error={errors.github}
                placeholder="Contoh: github.com/username"
              />

              <Input
                label="Website"
                name="website"
                value={profile.website}
                onChange={handleProfileChange}
                error={errors.website}
                placeholder="Contoh: website.com"
              />
            </div>
          </Card>

          {isStandardOrPremium && (
            <Card
              eyebrow="Standard Data"
              title="About, Skills, Tools"
              desc="Bagian ini tampil untuk paket Standard dan Premium."
            >
              <Textarea
                label="About Me"
                name="about_me"
                value={profile.about_me}
                onChange={handleProfileChange}
                error={errors.about_me}
                helper="Tuliskan profil singkat yang rapi, profesional, dan mudah dipahami."
                placeholder="Contoh: Saya adalah seorang Frontend Developer yang fokus membuat tampilan website modern dan responsif."
              />

              <ArraySection
                title="Skills"
                description="Tambah atau hapus skill sesuai kebutuhan portfolio."
                onAdd={() =>
                  addArrayItem(setSkills, {
                    nama_skill: "",
                    level_skill: "Mahir",
                  })
                }
              >
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 md:grid-cols-[1fr_220px_auto]"
                  >
                    <Input
                      label="Nama Skill"
                      value={skill.nama_skill}
                      onChange={(event) =>
                        updateArrayItem(
                          setSkills,
                          index,
                          "nama_skill",
                          event.target.value
                        )
                      }
                      placeholder="Contoh: React JS"
                    />

                    <Select
                      label="Level"
                      value={skill.level_skill}
                      onChange={(event) =>
                        updateArrayItem(
                          setSkills,
                          index,
                          "level_skill",
                          event.target.value
                        )
                      }
                    >
                      <option value="Pemula">Pemula</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Mahir">Mahir</option>
                      <option value="Expert">Expert</option>
                    </Select>

                    <RemoveButton
                      onClick={() => removeArrayItem(setSkills, index)}
                      disabled={skills.length === 1}
                    />
                  </div>
                ))}
              </ArraySection>

              <ArraySection
                title="Tools"
                description="Isi tools atau software yang digunakan."
                onAdd={() => addArrayItem(setTools, { nama_tools: "" })}
              >
                {tools.map((tool, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 md:grid-cols-[1fr_auto]"
                  >
                    <Input
                      label="Nama Tools"
                      value={tool.nama_tools}
                      onChange={(event) =>
                        updateArrayItem(
                          setTools,
                          index,
                          "nama_tools",
                          event.target.value
                        )
                      }
                      placeholder="Contoh: VS Code"
                    />

                    <RemoveButton
                      onClick={() => removeArrayItem(setTools, index)}
                      disabled={tools.length === 1}
                    />
                  </div>
                ))}
              </ArraySection>
            </Card>
          )}

          {isPremium && (
            <>
              <Card
                eyebrow="Premium Data"
                title="Projects"
                desc="Bagian project hanya tampil untuk paket Premium."
              >
                <ArraySection
                  title="Data Project"
                  description="Tambah project yang ingin ditampilkan pada portfolio."
                  onAdd={() =>
                    addArrayItem(setProjects, {
                      id: null,
                      nama_project: "",
                      deskripsi_project: "",
                      link_project: "",
                      gambar_project: "",
                    })
                  }
                >
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Nama Project"
                          value={project.nama_project}
                          onChange={(event) =>
                            updateArrayItem(
                              setProjects,
                              index,
                              "nama_project",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: Website Portfolio"
                        />

                        <Input
                          label="Link Project"
                          value={project.link_project}
                          onChange={(event) =>
                            updateArrayItem(
                              setProjects,
                              index,
                              "link_project",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: github.com/username/project"
                        />

                        {project.gambar_project && (
                          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 md:col-span-2">
                            <p className="text-sm font-black text-[#111827]">
                              Gambar Project Lama
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-4">
                              <img
                                src={storageUrl(project.gambar_project)}
                                alt={project.nama_project || "Gambar Project"}
                                className="h-28 w-40 rounded-2xl object-cover"
                              />

                              <p className="min-w-0 flex-1 break-all text-xs font-semibold leading-6 text-[#64748b]">
                                {project.gambar_project}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Textarea
                        label="Deskripsi Project"
                        value={project.deskripsi_project}
                        onChange={(event) =>
                          updateArrayItem(
                            setProjects,
                            index,
                            "deskripsi_project",
                            event.target.value
                          )
                        }
                        placeholder="Jelaskan project secara singkat."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setProjects, index)}
                        disabled={projects.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>
              </Card>

              <Card
                eyebrow="Premium Data"
                title="Pendidikan & Pengalaman"
                desc="Rapikan riwayat pendidikan dan pengalaman user."
              >
                <ArraySection
                  title="Pendidikan"
                  description="Tambah riwayat pendidikan yang relevan."
                  onAdd={() =>
                    addArrayItem(setEducations, {
                      nama_sekolah: "",
                      jurusan: "",
                      tahun_mulai: "",
                      tahun_selesai: "",
                      deskripsi: "",
                    })
                  }
                >
                  {educations.map((education, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Nama Sekolah / Kampus"
                          value={education.nama_sekolah}
                          onChange={(event) =>
                            updateArrayItem(
                              setEducations,
                              index,
                              "nama_sekolah",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: STMIK Mardira Indonesia"
                        />

                        <Input
                          label="Jurusan"
                          value={education.jurusan}
                          onChange={(event) =>
                            updateArrayItem(
                              setEducations,
                              index,
                              "jurusan",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: Sistem Informasi"
                        />

                        <Input
                          label="Tahun Mulai"
                          value={education.tahun_mulai}
                          onChange={(event) =>
                            updateArrayItem(
                              setEducations,
                              index,
                              "tahun_mulai",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: 2022"
                        />

                        <Input
                          label="Tahun Selesai"
                          value={education.tahun_selesai}
                          onChange={(event) =>
                            updateArrayItem(
                              setEducations,
                              index,
                              "tahun_selesai",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: 2026 / Sekarang"
                        />
                      </div>

                      <Textarea
                        label="Deskripsi"
                        value={education.deskripsi}
                        onChange={(event) =>
                          updateArrayItem(
                            setEducations,
                            index,
                            "deskripsi",
                            event.target.value
                          )
                        }
                        placeholder="Tuliskan ringkasan pendidikan."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setEducations, index)}
                        disabled={educations.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>

                <ArraySection
                  title="Pengalaman"
                  description="Tambah pengalaman kerja, magang, organisasi, atau freelance."
                  onAdd={() =>
                    addArrayItem(setExperiences, {
                      nama_tempat: "",
                      posisi: "",
                      tahun_mulai: "",
                      tahun_selesai: "",
                      deskripsi: "",
                    })
                  }
                >
                  {experiences.map((experience, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Nama Tempat / Perusahaan"
                          value={experience.nama_tempat}
                          onChange={(event) =>
                            updateArrayItem(
                              setExperiences,
                              index,
                              "nama_tempat",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: Freelance Project"
                        />

                        <Input
                          label="Posisi"
                          value={experience.posisi}
                          onChange={(event) =>
                            updateArrayItem(
                              setExperiences,
                              index,
                              "posisi",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: Frontend Developer"
                        />

                        <Input
                          label="Tahun Mulai"
                          value={experience.tahun_mulai}
                          onChange={(event) =>
                            updateArrayItem(
                              setExperiences,
                              index,
                              "tahun_mulai",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: 2024"
                        />

                        <Input
                          label="Tahun Selesai"
                          value={experience.tahun_selesai}
                          onChange={(event) =>
                            updateArrayItem(
                              setExperiences,
                              index,
                              "tahun_selesai",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: Sekarang"
                        />
                      </div>

                      <Textarea
                        label="Deskripsi"
                        value={experience.deskripsi}
                        onChange={(event) =>
                          updateArrayItem(
                            setExperiences,
                            index,
                            "deskripsi",
                            event.target.value
                          )
                        }
                        placeholder="Tuliskan tanggung jawab atau pencapaian utama."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setExperiences, index)}
                        disabled={experiences.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>
              </Card>

              <Card
                eyebrow="Premium Data"
                title="Sertifikat & Pencapaian"
                desc="Rapikan data sertifikat dan pencapaian user."
              >
                <ArraySection
                  title="Sertifikat"
                  description="File sertifikat tetap mengikuti upload user. Di sini admin merapikan teksnya."
                  onAdd={() =>
                    addArrayItem(setCertificates, {
                      id: null,
                      nama_sertifikat: "",
                      penerbit: "",
                      tahun: "",
                      file_sertifikat: "",
                    })
                  }
                >
                  {certificates.map((certificate, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 md:grid-cols-[1fr_1fr_160px_auto]"
                    >
                      <Input
                        label="Nama Sertifikat"
                        value={certificate.nama_sertifikat}
                        onChange={(event) =>
                          updateArrayItem(
                            setCertificates,
                            index,
                            "nama_sertifikat",
                            event.target.value
                          )
                        }
                        placeholder="Contoh: Frontend Web Development"
                      />

                      <Input
                        label="Penerbit"
                        value={certificate.penerbit}
                        onChange={(event) =>
                          updateArrayItem(
                            setCertificates,
                            index,
                            "penerbit",
                            event.target.value
                          )
                        }
                        placeholder="Contoh: Dicoding"
                      />

                      <Input
                        label="Tahun"
                        value={certificate.tahun}
                        onChange={(event) =>
                          updateArrayItem(
                            setCertificates,
                            index,
                            "tahun",
                            event.target.value
                          )
                        }
                        placeholder="2024"
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setCertificates, index)}
                        disabled={certificates.length === 1}
                      />

                      {certificate.file_sertifikat && (
                        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 md:col-span-4">
                          <p className="text-sm font-black text-[#111827]">
                            File Sertifikat Lama
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            {isPdfFile(certificate.file_sertifikat) ? (
                              <a
                                href={storageUrl(certificate.file_sertifikat)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white hover:bg-[#1d4ed8]"
                              >
                                Buka PDF Sertifikat
                              </a>
                            ) : (
                              <img
                                src={storageUrl(certificate.file_sertifikat)}
                                alt={
                                  certificate.nama_sertifikat || "Sertifikat"
                                }
                                className="h-28 w-40 rounded-2xl object-cover"
                              />
                            )}

                            <p className="min-w-0 flex-1 break-all text-xs font-semibold leading-6 text-[#64748b]">
                              {certificate.file_sertifikat}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </ArraySection>

                <ArraySection
                  title="Pencapaian"
                  description="Tambah pencapaian, prestasi, atau penghargaan."
                  onAdd={() =>
                    addArrayItem(setAchievements, {
                      nama_pencapaian: "",
                      deskripsi: "",
                      tahun: "",
                    })
                  }
                >
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Nama Pencapaian"
                          value={achievement.nama_pencapaian}
                          onChange={(event) =>
                            updateArrayItem(
                              setAchievements,
                              index,
                              "nama_pencapaian",
                              event.target.value
                            )
                          }
                          placeholder="Contoh: Juara 2 UI/UX Design"
                        />

                        <Input
                          label="Tahun"
                          value={achievement.tahun}
                          onChange={(event) =>
                            updateArrayItem(
                              setAchievements,
                              index,
                              "tahun",
                              event.target.value
                            )
                          }
                          placeholder="2024"
                        />
                      </div>

                      <Textarea
                        label="Deskripsi"
                        value={achievement.deskripsi}
                        onChange={(event) =>
                          updateArrayItem(
                            setAchievements,
                            index,
                            "deskripsi",
                            event.target.value
                          )
                        }
                        placeholder="Tuliskan deskripsi pencapaian."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setAchievements, index)}
                        disabled={achievements.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>
              </Card>
            </>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || !canEdit}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Data Portfolio"}
            </button>

            <Link
              to={`/admin/orders/${id}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-7 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
            >
              Kembali ke Detail Order
            </Link>

            <Link
              to={`/admin/orders/${id}/preview-portfolio`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-7 text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe]"
            >
              Preview Portfolio
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

const HeroBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-2 block break-words text-xl font-black tracking-[-0.04em] text-white">
        {value || "-"}
      </strong>
    </div>
  );
};

const Card = ({ eyebrow, title, desc, children }) => {
  return (
    <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-[clamp(28px,4vw,40px)] font-black leading-none tracking-[-0.05em]">
        {title}
      </h2>

      {desc && (
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#64748b]">
          {desc}
        </p>
      )}

      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  placeholder = "",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
      />

      {error && (
        <small className="mt-2 block text-sm font-semibold text-red-600">
          {Array.isArray(error) ? error[0] : error}
        </small>
      )}
    </label>
  );
};

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  helper = "",
  error,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold leading-7 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
      />

      {helper && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helper}
        </small>
      )}

      {error && (
        <small className="mt-2 block text-sm font-semibold text-red-600">
          {Array.isArray(error) ? error[0] : error}
        </small>
      )}
    </label>
  );
};

const Select = ({ label, value, onChange, children }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label}
      </span>

      <select
        value={value}
        onChange={onChange}
        className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 text-sm font-black text-[#111827] outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
      >
        {children}
      </select>
    </label>
  );
};

const ArraySection = ({ title, description, onAdd, children }) => {
  return (
    <div className="rounded-[28px] border border-[#e5e7eb] bg-[#f8fafc] p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm font-semibold leading-6 text-[#64748b]">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white hover:bg-[#1d4ed8]"
        >
          Tambah
        </button>
      </div>

      <div className="grid gap-4">{children}</div>
    </div>
  );
};

const RemoveButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 text-sm font-black text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Hapus
    </button>
  );
};

const StatusBadge = ({ status, children }) => {
  const statusData = getStatusData(status);

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black ${statusData.className}`}
    >
      {children}
    </span>
  );
};

const normalizeText = (value) => {
  return String(value || "").toLowerCase().trim();
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const getStatusData = (status) => {
  const normalized = normalizeStatus(status);

  const statusMap = {
    pending: {
      label: "Pending",
      className: "bg-[#fff7ed] text-[#f97316]",
    },
    belum_bayar: {
      label: "Belum Bayar",
      className: "bg-[#fff7ed] text-[#f97316]",
    },
    unpaid: {
      label: "Belum Bayar",
      className: "bg-[#fff7ed] text-[#f97316]",
    },
    menunggu_verifikasi: {
      label: "Verifikasi",
      className: "bg-[#eff6ff] text-[#2563eb]",
    },
    waiting: {
      label: "Verifikasi",
      className: "bg-[#eff6ff] text-[#2563eb]",
    },
    lunas: {
      label: "Lunas",
      className: "bg-emerald-50 text-emerald-600",
    },
    paid: {
      label: "Lunas",
      className: "bg-emerald-50 text-emerald-600",
    },
    diproses: {
      label: "Diproses",
      className: "bg-[#f8fafc] text-[#0f172a]",
    },
    processing: {
      label: "Diproses",
      className: "bg-[#f8fafc] text-[#0f172a]",
    },
    selesai: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    completed: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    success: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    ditolak: {
      label: "Ditolak",
      className: "bg-red-50 text-red-600",
    },
    rejected: {
      label: "Ditolak",
      className: "bg-red-50 text-red-600",
    },
    failed: {
      label: "Ditolak",
      className: "bg-red-50 text-red-600",
    },
  };

  return (
    statusMap[normalized] || {
      label: status || "-",
      className: "bg-[#f8fafc] text-[#64748b]",
    }
  );
};

const formatStatus = (status) => {
  return getStatusData(status).label;
};

const formatPackage = (paket) => {
  if (!paket) return "-";
  return String(paket).charAt(0).toUpperCase() + String(paket).slice(1);
};

const storageUrl = (path) => {
  return resolveStorageUrl(path) || "";
};

const isPdfFile = (path) => {
  return String(path || "").toLowerCase().includes(".pdf");
};

export default AdminPortfolioEditPage;

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
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
};

const initialPayment = {
  metode_pembayaran: "",
  bank_atau_ewallet_pengirim: "",
  nomor_pengirim: "",
  nama_pengirim: "",
  jumlah_pembayaran: "",
  tanggal_pembayaran: "",
};

const paymentDestinations = [
  {
    name: "BCA",
    type: "Bank Transfer",
    number: "1234567890",
    owner: "Build Portfolio",
    note: "Transfer sesuai nominal paket yang dipilih.",
  },
  {
    name: "BRI",
    type: "Bank Transfer",
    number: "0987654321",
    owner: "Build Portfolio",
    note: "Pastikan nama pengirim sesuai dengan data pembayaran.",
  },
  {
    name: "DANA / GoPay",
    type: "E-Wallet",
    number: "081234567890",
    owner: "Build Portfolio",
    note: "Kirim bukti pembayaran setelah transfer berhasil.",
  },
];

const OrderCreatePage = () => {
  const { id, paket } = useParams();
  const navigate = useNavigate();

  const selectedPackage = (paket || "basic").toLowerCase();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [profile, setProfile] = useState(initialProfile);
  const [payment, setPayment] = useState(initialPayment);

  const [fotoProfil, setFotoProfil] = useState(null);
  const [fotoBuktiPembayaran, setFotoBuktiPembayaran] = useState(null);

  const [skills, setSkills] = useState([
    { nama_skill: "", level_skill: "Mahir" },
  ]);

  const [tools, setTools] = useState([{ nama_tools: "" }]);

  const [projects, setProjects] = useState([
    {
      nama_project: "",
      deskripsi_project: "",
      link_project: "",
      gambar_project_file: null,
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
      nama_sertifikat: "",
      penerbit: "",
      tahun: "",
      file_sertifikat_file: null,
    },
  ]);

  const [achievements, setAchievements] = useState([
    {
      nama_pencapaian: "",
      deskripsi: "",
      tahun: "",
    },
  ]);

  const isBasic = selectedPackage === "basic";
  const isStandard = selectedPackage === "standard";
  const isPremium = selectedPackage === "premium";

  const packageLabel = useMemo(() => {
    if (isBasic) return "Basic";
    if (isStandard) return "Standard";
    if (isPremium) return "Premium";
    return selectedPackage;
  }, [isBasic, isStandard, isPremium, selectedPackage]);

  const packagePrice = useMemo(() => {
    if (!template) return 0;

    if (isBasic) return Number(template.harga_basic || 0);
    if (isStandard) return Number(template.harga_standard || 0);
    if (isPremium) return Number(template.harga_premium || 0);

    return 0;
  }, [template, isBasic, isStandard, isPremium]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setMessage("");
        setErrors({});

        const response = await axiosInstance.get(`/templates/${id}`);
        const data = response.data.data || response.data;

        setTemplate(data);

        const price =
          selectedPackage === "basic"
            ? data.harga_basic
            : selectedPackage === "standard"
            ? data.harga_standard
            : data.harga_premium;

        setPayment((prev) => ({
          ...prev,
          jumlah_pembayaran: price ? String(price) : "",
        }));

      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Gagal mengambil detail template.";

        setMessage(errorMessage);
        await showErrorAlert("Gagal Memuat Template", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, selectedPackage]);

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

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPayment((prev) => ({
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

  const cleanArray = (items, requiredKey, excludedKeys = []) => {
    return items
      .filter((item) => String(item[requiredKey] || "").trim())
      .map((item) => {
        const cleaned = {};

        Object.entries(item).forEach(([key, value]) => {
          if (!excludedKeys.includes(key)) {
            cleaned[key] = value;
          }
        });

        return cleaned;
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmCreate = await showConfirmAlert({
      title: "Buat pesanan portfolio?",
      text: `Pesanan paket ${packageLabel} akan dibuat dan pembayaran akan dikirim untuk verifikasi admin.`,
      confirmButtonText: "Ya, buat pesanan",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmCreate.isConfirmed) return;

    try {
      setSubmitting(true);
      setMessage("");
      setErrors({});

      const formData = new FormData();

      formData.append("template_id", id);
      formData.append("paket", selectedPackage);

      formData.append("nama_lengkap", profile.nama_lengkap);
      formData.append("profesi", profile.profesi);
      formData.append("email", profile.email);
      formData.append("nomor_hp", profile.nomor_hp);
      formData.append("instagram", profile.instagram);
      formData.append("linkedin", profile.linkedin);
      formData.append("github", profile.github);
      formData.append("website", profile.website);

      if (fotoProfil) {
        formData.append("foto_profil", fotoProfil);
      }

      if (isStandard || isPremium) {
        formData.append("about_me", profile.about_me);
        formData.append(
          "skills",
          JSON.stringify(cleanArray(skills, "nama_skill"))
        );
        formData.append("tools", JSON.stringify(cleanArray(tools, "nama_tools")));
      }

      if (isPremium) {
        const cleanProjects = cleanArray(projects, "nama_project", [
          "gambar_project_file",
        ]);

        const cleanCertificates = cleanArray(certificates, "nama_sertifikat", [
          "file_sertifikat_file",
        ]);

        formData.append("projects", JSON.stringify(cleanProjects));
        formData.append(
          "educations",
          JSON.stringify(cleanArray(educations, "nama_sekolah"))
        );
        formData.append(
          "experiences",
          JSON.stringify(cleanArray(experiences, "nama_tempat"))
        );
        formData.append("certificates", JSON.stringify(cleanCertificates));
        formData.append(
          "achievements",
          JSON.stringify(cleanArray(achievements, "nama_pencapaian"))
        );

        projects.forEach((project, index) => {
          if (project.gambar_project_file) {
            formData.append(
              `project_images[${index}]`,
              project.gambar_project_file
            );
          }
        });

        certificates.forEach((certificate, index) => {
          if (certificate.file_sertifikat_file) {
            formData.append(
              `certificate_files[${index}]`,
              certificate.file_sertifikat_file
            );
          }
        });
      }

      formData.append("metode_pembayaran", payment.metode_pembayaran);
      formData.append(
        "bank_atau_ewallet_pengirim",
        payment.bank_atau_ewallet_pengirim
      );
      formData.append("nomor_pengirim", payment.nomor_pengirim);
      formData.append("nama_pengirim", payment.nama_pengirim);
      formData.append("jumlah_pembayaran", payment.jumlah_pembayaran);
      formData.append("tanggal_pembayaran", payment.tanggal_pembayaran);

      if (fotoBuktiPembayaran) {
        formData.append("foto_bukti_pembayaran", fotoBuktiPembayaran);
      }

      const response = await axiosInstance.post("/user/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdOrder = response.data.data || response.data;

      const successMessage =
        response.data.message ||
        "Pesanan berhasil dibuat. Pembayaran menunggu verifikasi admin.";

      setMessage(successMessage);

      await showSuccessAlert(
        "Pesanan Berhasil Dibuat",
        "Pesanan kamu berhasil dikirim. Pembayaran akan diverifikasi oleh admin."
      );

      navigate(`/user/orders/${createdOrder.id}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal membuat pesanan.";

      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});

      await showErrorAlert("Gagal Membuat Pesanan", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[360px] animate-pulse rounded-[34px] bg-white shadow-sm" />
          <div className="mt-6 h-[520px] animate-pulse rounded-[30px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600">
            {message || "Template tidak ditemukan."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Buat Pesanan
              </p>

              <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                {template.nama_template}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Isi data portfolio sesuai paket yang dipilih. Data ini akan
                digunakan untuk membuat preview dan hasil akhir portfolio kamu.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/user/templates/${id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Kembali ke Detail Template
                </Link>

                <Link
                  to="/user/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Order Saya
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroInfo label="Paket" value={packageLabel} />
                <HeroInfo
                  label="Harga"
                  value={`Rp${Number(packagePrice || 0).toLocaleString(
                    "id-ID"
                  )}`}
                />
                <HeroInfo label="Kategori" value={template.kategori || "-"} />
                <HeroInfo
                  label="Data"
                  value={
                    isBasic
                      ? "Basic"
                      : isStandard
                      ? "Profile + Skills"
                      : "Lengkap"
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-bold leading-7 ${
              Object.keys(errors).length > 0
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]"
            }`}
          >
            <p>{message}</p>

            {Object.keys(errors).length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                {Object.entries(errors).map(([field, messages]) => (
                  <li key={field}>
                    {formatValidationMessage(
                      field,
                      Array.isArray(messages) ? messages[0] : messages
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          <Card eyebrow="Profile" title="Data Pribadi">
            <SectionNote>
              Data ini akan muncul di bagian utama portfolio kamu. Isi dengan
              data yang rapi dan mudah dihubungi.
            </SectionNote>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                name="nama_lengkap"
                value={profile.nama_lengkap}
                onChange={handleProfileChange}
                required
                placeholder="Contoh: Tiaa Anggraeni"
                helperText="Isi nama lengkap yang akan ditampilkan pada portfolio."
              />

              <Input
                label="Profesi"
                name="profesi"
                value={profile.profesi}
                onChange={handleProfileChange}
                required
                placeholder="Contoh: Frontend Developer"
                helperText="Isi profesi atau bidang utama yang ingin ditampilkan."
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
                placeholder="Contoh: tiaaanggraeni@gmail.com"
                helperText="Gunakan email aktif yang bisa dihubungi."
              />

              <Input
                label="Nomor HP"
                name="nomor_hp"
                value={profile.nomor_hp}
                onChange={handleProfileChange}
                required
                placeholder="Contoh: 081234567890"
                helperText="Isi nomor WhatsApp atau nomor aktif."
              />

              <Input
                label="Instagram"
                name="instagram"
                value={profile.instagram}
                onChange={handleProfileChange}
                placeholder="Contoh: @tiaaanggraeni"
                helperText="Opsional. Isi username Instagram."
              />

              <Input
                label="LinkedIn"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleProfileChange}
                placeholder="Contoh: linkedin.com/in/tiaaanggraeni"
                helperText="Opsional. Isi link profil LinkedIn."
              />

              <Input
                label="GitHub"
                name="github"
                value={profile.github}
                onChange={handleProfileChange}
                placeholder="Contoh: github.com/tiaaanggraeni"
                helperText="Opsional. Isi link GitHub."
              />

              <Input
                label="Website"
                name="website"
                value={profile.website}
                onChange={handleProfileChange}
                placeholder="Contoh: tiaaportfolio.com"
                helperText="Opsional. Isi website pribadi."
              />
            </div>

            <FileInput
              label="Foto Profil"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(event) => setFotoProfil(event.target.files[0])}
              required
              helperText="Gunakan foto yang jelas, formal atau semi formal."
            />
          </Card>

          {(isStandard || isPremium) && (
            <Card eyebrow="Content" title="Tentang, Skills, dan Tools">
              <SectionNote>
                Bagian ini muncul untuk paket Standard dan Premium. Isi dengan
                ringkas agar portfolio terlihat profesional.
              </SectionNote>

              <Textarea
                label="Tentang Saya"
                name="about_me"
                value={profile.about_me}
                onChange={handleProfileChange}
                rows={5}
                required
                placeholder="Contoh: Saya adalah seorang Frontend Developer yang berfokus pada pembuatan tampilan website modern, responsif, dan mudah digunakan."
                helperText="Tuliskan ringkasan profil diri, fokus keahlian, dan tujuan profesional."
              />

              <ArraySection
                title="Skills"
                description="Minimal isi 1 skill."
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
                      helperText="Isi nama keahlian."
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
                      helperText="Pilih tingkat kemampuan."
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
                description="Isi tools atau software yang biasa digunakan."
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
                      placeholder="Contoh: Figma"
                      helperText="Contoh: VS Code, Figma, Postman, GitHub."
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
              <Card eyebrow="Premium" title="Projects">
                <ArraySection
                  title="Data Project"
                  description="Minimal isi 1 project."
                  onAdd={() =>
                    addArrayItem(setProjects, {
                      nama_project: "",
                      deskripsi_project: "",
                      link_project: "",
                      gambar_project_file: null,
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
                          placeholder="Contoh: Website Portfolio Personal"
                          helperText="Isi judul project."
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
                          placeholder="Contoh: https://github.com/username/project"
                          helperText="Opsional. Isi link GitHub/demo."
                        />
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
                        rows={4}
                        placeholder="Contoh: Website portfolio modern untuk menampilkan profil, keahlian, project, dan kontak profesional secara rapi."
                        helperText="Tuliskan deskripsi singkat dan profesional."
                      />

                      <FileInput
                        label="Gambar Project"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(event) =>
                          updateArrayItem(
                            setProjects,
                            index,
                            "gambar_project_file",
                            event.target.files[0]
                          )
                        }
                        helperText="Upload screenshot atau preview project."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setProjects, index)}
                        disabled={projects.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>
              </Card>

              <Card eyebrow="Premium" title="Pendidikan & Pengalaman">
                <ArraySection
                  title="Pendidikan"
                  description="Isi riwayat pendidikan yang ingin ditampilkan."
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
                          helperText="Isi nama institusi pendidikan."
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
                          helperText="Isi jurusan atau program studi."
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
                          helperText="Isi tahun mulai."
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
                          helperText="Isi tahun selesai."
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
                        placeholder="Contoh: Mempelajari pengembangan web, database, analisis sistem, dan manajemen proyek."
                        helperText="Tuliskan ringkasan pendidikan."
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
                  description="Isi pengalaman kerja, organisasi, freelance, magang, atau project."
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
                          helperText="Isi nama perusahaan, organisasi, atau tempat pengalaman."
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
                          helperText="Isi posisi atau peran."
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
                          helperText="Isi tahun mulai."
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
                          helperText="Isi tahun selesai."
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
                        placeholder="Contoh: Membuat tampilan website responsif dan menghubungkan data dari API."
                        helperText="Tuliskan tanggung jawab atau pencapaian."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setExperiences, index)}
                        disabled={experiences.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>
              </Card>

              <Card eyebrow="Premium" title="Sertifikat & Pencapaian">
                <ArraySection
                  title="Sertifikat"
                  description="Isi sertifikat yang relevan dengan portfolio."
                  onAdd={() =>
                    addArrayItem(setCertificates, {
                      nama_sertifikat: "",
                      penerbit: "",
                      tahun: "",
                      file_sertifikat_file: null,
                    })
                  }
                >
                  {certificates.map((certificate, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-3">
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
                          placeholder="Contoh: Sertifikat Frontend Web Development"
                          helperText="Isi nama sertifikat."
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
                          helperText="Isi nama lembaga penerbit."
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
                          placeholder="Contoh: 2024"
                          helperText="Isi tahun sertifikat."
                        />
                      </div>

                      <FileInput
                        label="File Sertifikat"
                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                        onChange={(event) =>
                          updateArrayItem(
                            setCertificates,
                            index,
                            "file_sertifikat_file",
                            event.target.files[0]
                          )
                        }
                        helperText="Upload file JPG, PNG, atau PDF."
                      />

                      <RemoveButton
                        onClick={() => removeArrayItem(setCertificates, index)}
                        disabled={certificates.length === 1}
                      />
                    </div>
                  ))}
                </ArraySection>

                <ArraySection
                  title="Pencapaian"
                  description="Isi pencapaian, penghargaan, lomba, atau prestasi."
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
                          placeholder="Contoh: Juara 2 Lomba UI/UX Design"
                          helperText="Isi nama pencapaian."
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
                          placeholder="Contoh: 2024"
                          helperText="Isi tahun pencapaian."
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
                        placeholder="Contoh: Meraih juara dalam kompetisi desain antarmuka aplikasi edukasi."
                        helperText="Tuliskan penjelasan singkat."
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

          <Card eyebrow="Payment" title="Data Pembayaran">
            <SectionNote>
              Pilih salah satu rekening tujuan, lakukan pembayaran sesuai harga
              paket, lalu upload bukti transfer yang jelas.
            </SectionNote>

            <div className="grid gap-4 md:grid-cols-3">
              {paymentDestinations.map((destination) => (
                <PaymentDestinationCard
                  key={destination.name}
                  destination={destination}
                />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Metode Pembayaran"
                name="metode_pembayaran"
                value={payment.metode_pembayaran}
                onChange={handlePaymentChange}
                required
                placeholder="Contoh: Transfer Bank / E-Wallet"
                helperText="Isi metode pembayaran yang kamu gunakan."
              />

              <Input
                label="Bank / E-Wallet Pengirim"
                name="bank_atau_ewallet_pengirim"
                value={payment.bank_atau_ewallet_pengirim}
                onChange={handlePaymentChange}
                required
                placeholder="Contoh: BCA / DANA / GoPay"
                helperText="Isi nama bank atau e-wallet pengirim."
              />

              <Input
                label="Nomor Pengirim"
                name="nomor_pengirim"
                value={payment.nomor_pengirim}
                onChange={handlePaymentChange}
                required
                placeholder="Contoh: 081234567890"
                helperText="Isi nomor rekening/e-wallet pengirim."
              />

              <Input
                label="Nama Pengirim"
                name="nama_pengirim"
                value={payment.nama_pengirim}
                onChange={handlePaymentChange}
                required
                placeholder="Contoh: Tiaa Anggraeni"
                helperText="Isi nama pemilik rekening/e-wallet pengirim."
              />

              <Input
                label="Jumlah Pembayaran"
                name="jumlah_pembayaran"
                value={payment.jumlah_pembayaran}
                onChange={handlePaymentChange}
                required
                readOnly
                placeholder="Otomatis sesuai harga paket"
                helperText="Jumlah pembayaran otomatis mengikuti harga paket."
              />

              <Input
                label="Tanggal Pembayaran"
                name="tanggal_pembayaran"
                type="date"
                value={payment.tanggal_pembayaran}
                onChange={handlePaymentChange}
                required
                helperText="Pilih tanggal ketika pembayaran dilakukan."
              />
            </div>

            <FileInput
              label="Foto Bukti Pembayaran"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(event) =>
                setFotoBuktiPembayaran(event.target.files[0])
              }
              required
              helperText="Upload screenshot atau foto bukti transfer yang jelas."
            />
          </Card>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Mengirim Pesanan..." : "Buat Pesanan"}
            </button>

            <Link
              to={`/user/templates/${id}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-7 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
            >
              Kembali
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

const Card = ({ eyebrow, title, children }) => {
  return (
    <section className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-7">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-[clamp(28px,4vw,40px)] font-black leading-none tracking-[-0.05em] text-[#111827]">
        {title}
      </h2>

      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
};

const HeroInfo = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-1 block text-sm text-white">{value || "-"}</strong>
    </div>
  );
};

const SectionNote = ({ children }) => {
  return (
    <div className="rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold leading-7 text-[#2563eb]">
      {children}
    </div>
  );
};

const PaymentDestinationCard = ({ destination }) => {
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-[#f8fafc] p-5">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-xl font-black text-[#111827]">
          {destination.name}
        </strong>

        <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-black text-[#f97316]">
          {destination.type}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
            Nomor
          </span>
          <strong className="mt-1 block break-words text-lg text-[#111827]">
            {destination.number}
          </strong>
        </div>

        <div>
          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
            Atas Nama
          </span>
          <strong className="mt-1 block break-words text-[#111827]">
            {destination.owner}
          </strong>
        </div>

        <p className="text-sm leading-6 text-[#64748b]">{destination.note}</p>
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  name,
  type = "text",
  required = false,
  readOnly = false,
  placeholder = "",
  helperText = "",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10 read-only:cursor-not-allowed read-only:bg-[#eef2f7] read-only:text-[#64748b]"
      />

      {helperText && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helperText}
        </small>
      )}
    </label>
  );
};

const Textarea = ({
  label,
  value,
  onChange,
  name,
  rows = 4,
  required = false,
  placeholder = "",
  helperText = "",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-semibold leading-7 text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
      />

      {helperText && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helperText}
        </small>
      )}
    </label>
  );
};

const Select = ({ label, value, onChange, children, helperText = "" }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label}
      </span>

      <select
        value={value}
        onChange={onChange}
        className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-black text-[#111827] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
      >
        {children}
      </select>

      {helperText && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helperText}
        </small>
      )}
    </label>
  );
};

const FileInput = ({
  label,
  onChange,
  accept,
  required = false,
  helperText = "",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <input
        type="file"
        accept={accept}
        required={required}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#64748b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#2563eb] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
      />

      {helperText && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helperText}
        </small>
      )}
    </label>
  );
};

const ArraySection = ({ title, description, onAdd, children }) => {
  return (
    <div className="rounded-[26px] border border-[#e5e7eb] bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm leading-6 text-[#64748b]">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#eff6ff] px-5 text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe]"
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
      className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Hapus
    </button>
  );
};

export default OrderCreatePage;
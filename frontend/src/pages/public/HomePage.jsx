import { Link } from "react-router-dom";

const HomePage = () => {
  const steps = [
    {
      number: "01",
      title: "Pilih Template",
      desc: "Lihat template portfolio yang tersedia, lalu pilih desain yang paling sesuai dengan kebutuhan kamu.",
      image: "/images/home/step-1.png",
    },
    {
      number: "02",
      title: "Pilih Paket",
      desc: "Pilih Basic, Standard, atau Premium sesuai data portfolio yang ingin kamu tampilkan.",
      image: "/images/home/step-2.png",
    },
    {
      number: "03",
      title: "Isi Data & Bayar",
      desc: "Lengkapi data portfolio, lakukan pembayaran manual, lalu upload bukti transfer.",
      image: "/images/home/step-3.png",
    },
    {
      number: "04",
      title: "Dapat Link Final",
      desc: "Admin memproses portfolio dan mengaktifkan link final yang bisa dibagikan tanpa login.",
      image: "/images/home/step-4.png",
    },
  ];

  const features = [
    {
      title: "Template Siap Pakai",
      desc: "Tidak perlu membuat desain dari nol. Kamu cukup pilih template dan isi data sesuai paket.",
    },
    {
      title: "Preview Sebelum Final",
      desc: "Portfolio bisa dicek terlebih dahulu oleh user dan admin sebelum link final diaktifkan.",
    },
    {
      title: "Link Public",
      desc: "Hasil akhir bisa dibuka oleh HRD, dosen, klien, atau siapa pun tanpa perlu login.",
    },
  ];

  const packages = [
    {
      name: "Basic",
      desc: "Untuk portfolio sederhana dengan informasi utama.",
      points: ["Data diri", "Kontak", "Template final"],
    },
    {
      name: "Standard",
      desc: "Untuk profil profesional yang lebih lengkap.",
      points: ["Data diri", "About me", "Skills", "Tools"],
    },
    {
      name: "Premium",
      desc: "Untuk portfolio lengkap dan personal branding.",
      points: ["Projects", "Education", "Experience", "Certificates"],
    },
  ];

  const faqs = [
  {
    question: "Apa itu Build Portfolio?",
    answer:
      "Build Portfolio adalah platform untuk membuat website portfolio profesional dengan cara memilih template, memilih paket, mengisi data, upload bukti pembayaran, lalu mendapatkan link portfolio final.",
  },
  {
    question: "Bagaimana cara membuat portfolio?",
    answer:
      "Kamu bisa mulai dari halaman template, pilih desain yang disukai, pilih paket, isi data sesuai paket, lalu upload bukti pembayaran agar admin dapat memproses pesanan.",
  },
  {
    question: "Apakah portfolio bisa dibuka tanpa login?",
    answer:
      "Bisa. Setelah admin menyelesaikan order dan mengaktifkan link final, portfolio bisa dibuka oleh siapa pun tanpa harus login.",
  },
  {
    question: "Apa bedanya paket Basic, Standard, dan Premium?",
    answer:
      "Basic berisi informasi utama dan kontak. Standard menambahkan about me, skills, dan tools. Premium lebih lengkap dengan project, pendidikan, pengalaman, sertifikat, dan pencapaian.",
  },
  {
    question: "Apakah saya bisa melihat preview sebelum portfolio final aktif?",
    answer:
      "Bisa. Preview portfolio dapat dilihat setelah pembayaran disetujui dan order mulai diproses. Admin juga dapat mengecek hasilnya sebelum mengaktifkan link final.",
  },
  {
    question: "Kalau pembayaran ditolak, apakah bisa upload ulang bukti?",
    answer:
      "Bisa, selama order tidak ditolak total oleh admin. User bisa upload ulang bukti pembayaran melalui halaman detail order.",
  },
  {
    question: "Apakah link portfolio final bisa dibagikan ke HRD atau dosen?",
    answer:
      "Bisa. Link final memang dibuat agar bisa dibagikan ke HRD, dosen, klien, teman, atau kebutuhan profesional lainnya.",
  },
  {
    question: "Apakah data portfolio bisa diedit oleh admin sebelum final?",
    answer:
      "Bisa. Saat order sudah diproses, admin dapat mengecek dan merapikan data portfolio sebelum menyelesaikan order dan mengaktifkan link final.",
  },
];

  return (
    <main className="overflow-hidden text-[#111827]">
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
                Portfolio Website Builder
              </span>
            </div>

            <h1 className="max-w-3xl text-[clamp(34px,4.4vw,56px)] font-black leading-[1] tracking-[-0.045em] text-[#111827]">
              Buat portfolio website yang siap dibagikan.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#64748b] md:text-base">
              Pilih template, isi data sesuai paket, upload bukti pembayaran,
              lalu dapatkan link portfolio final yang bisa dibagikan ke HRD,
              dosen, klien, atau kebutuhan profesional lainnya.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/templates"
                className="inline-flex min-h-11 min-w-[150px] items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
              >
                Lihat Template
              </Link>

              <Link
                to="/register"
                className="inline-flex min-h-11 min-w-[150px] items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-black text-[#111827] shadow-sm transition hover:bg-[#f3f4f6]"
              >
                Mulai Sekarang
              </Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <StatCard value="3" label="Template" />
              <StatCard value="3" label="Paket" />
              <StatCard value="24/7" label="Link Public" />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[30px] border border-[#e5e7eb] bg-white p-3 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
              <div className="h-[320px] overflow-hidden rounded-[24px] bg-[#f8fafc] md:h-[380px] lg:h-[420px]">
                <img
                  src="/images/home/hero-image.png"
                  alt="Preview portfolio"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    

      <section className="bg-[#fcfcfd] px-4 py-10 md:py-12">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                Why Build Portfolio
              </p>

              <h2 className="mt-3 text-[clamp(26px,3.4vw,40px)] font-black leading-[1.06] tracking-[-0.035em] text-[#0f172a]">
                Portfolio yang simpel dibuat, tapi tetap terlihat profesional.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-6 text-[#64748b] md:text-sm">
                Build Portfolio membantu user membuat portfolio dengan alur yang
                jelas, tampilan rapi, dan link final yang siap dibagikan.
              </p>
            </div>

            <Link
              to="/templates"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#dbe2ea] bg-white px-5 text-xs font-black text-[#0f172a] shadow-sm transition hover:bg-[#f8fafc]"
            >
              Explore Template
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-[22px] border border-[#e7ecf2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)]"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-2xl text-xs font-black text-white ${
                      index === 0
                        ? "bg-[#2563eb]"
                        : index === 1
                          ? "bg-[#0f172a]"
                          : "bg-[#f97316]"
                    }`}
                  >
                    0{index + 1}
                  </div>

                  <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#64748b]">
                    Benefit
                  </span>
                </div>

                <h3 className="text-lg font-black tracking-[-0.03em] text-[#0f172a]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-[#64748b] md:text-sm">
                  {feature.desc}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#eef2f7] pt-4">
                  <span className="text-[11px] font-bold text-[#94a3b8]">
                    Build Portfolio
                  </span>

                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
                      index === 0
                        ? "bg-[#eff6ff] text-[#2563eb]"
                        : index === 1
                          ? "bg-[#f8fafc] text-[#0f172a]"
                          : "bg-[#fff7ed] text-[#f97316]"
                    }`}
                  >
                    →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-[#0f172a] px-4 py-10 text-white md:py-12">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-7 text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#fdba74]">
              How it works
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[clamp(26px,3.4vw,40px)] font-black leading-[1.08] tracking-[-0.035em]">
              Alur order dari awal sampai portfolio siap dibagikan.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-white/70 md:text-sm">
              User pilih template, isi data, upload pembayaran, lalu admin memproses
              hingga link final portfolio aktif dan bisa dibuka tanpa login.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="overflow-hidden rounded-[22px] bg-white text-[#111827] shadow-[0_14px_32px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-[105px] overflow-hidden bg-[#f8fafc]">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#2563eb] text-[11px] font-black text-white shadow-md">
                    {step.number}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-black tracking-[-0.025em] text-[#111827]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#64748b]">
                    {step.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff7ed] px-4 py-14 md:py-16">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              Packages
            </p>

            <h2 className="mt-3 text-[clamp(30px,4vw,48px)] font-black leading-none tracking-[-0.04em] text-[#111827]">
              Pilih paket sesuai kebutuhan portfolio kamu.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#64748b] md:text-base">
              Setiap paket menentukan data apa saja yang bisa dimasukkan ke
              dalam template. Semakin lengkap paketnya, semakin lengkap hasil
              portfolio final kamu.
            </p>

            <Link
              to="/templates"
              className="mt-7 inline-flex min-h-11 min-w-[150px] items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
            >
              Pilih Template
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {packages.map((item, index) => (
              <article
                key={item.name}
                className={`rounded-[26px] border p-5 shadow-sm ${
                  index === 2
                    ? "border-[#bfdbfe] bg-[#eff6ff]"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2563eb]">
                  Paket
                </span>

                <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#111827]">
                  {item.name}
                </h3>

                <p className="mt-3 min-h-[76px] text-sm leading-7 text-[#64748b]">
                  {item.desc}
                </p>

                <div className="mt-5 grid gap-3">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827]"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-[#f8f5ef] px-4 py-10 md:py-12">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              FAQ
            </p>

            <h2 className="mt-3 max-w-md text-[clamp(26px,3.4vw,42px)] font-black leading-[1.05] tracking-[-0.04em] text-[#111827]">
              Pertanyaan yang sering ditanyakan.
            </h2>

            <p className="mt-4 max-w-md text-xs leading-6 text-[#64748b] md:text-sm">
              Beberapa jawaban singkat tentang proses order, paket, pembayaran,
              preview, dan link portfolio final.
            </p>

            <Link
              to="/templates"
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-[#2563eb] px-5 text-xs font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
            >
              Mulai dari Template
            </Link>

            <div className="mt-7 max-w-[300px] overflow-hidden rounded-[24px] border border-[#e5e7eb] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
              <img
                src="/images/home/faq-person.png"
                alt="Pertanyaan tentang Build Portfolio"
                className="h-[210px] w-full object-cover"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-5">
            <div className="divide-y divide-[#e5e7eb]">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group py-3 first:pt-0 last:pb-0"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                    <span className="text-xs font-black text-[#111827] md:text-sm">
                      {faq.question}
                    </span>

                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xs font-black text-[#2563eb] transition group-open:rotate-180">
                      ˅
                    </span>
                  </summary>

                  <p className="mt-2 max-w-3xl text-xs leading-6 text-[#64748b]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:py-16">
        <div className="mx-auto max-w-[1180px] rounded-[30px] border border-[#e5e7eb] bg-white p-7 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
            Ready to build?
          </p>

          <h2 className="mx-auto mt-3 max-w-4xl text-[clamp(30px,4.2vw,52px)] font-black leading-none tracking-[-0.04em] text-[#111827]">
            Buat portfolio yang bisa langsung kamu bagikan.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#64748b] md:text-base">
            Mulai dari template, isi data, upload pembayaran, lalu tunggu admin
            mengaktifkan link final portfolio kamu.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/templates"
              className="inline-flex min-h-11 min-w-[150px] items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
            >
              Lihat Template
            </Link>

            <Link
              to="/login"
              className="inline-flex min-h-11 min-w-[120px] items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-black text-[#111827] hover:bg-[#f3f4f6]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

const StatCard = ({ value, label }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <strong className="block text-xl font-black tracking-[-0.04em] text-[#111827]">
        {value}
      </strong>
      <span className="mt-1 block text-[11px] font-bold text-[#64748b]">
        {label}
      </span>
    </div>
  );
};

const HeroTag = ({ text, className = "" }) => {
  return (
    <span
      className={`absolute rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-[10px] font-black text-[#111827] shadow-sm ${className}`}
    >
      {text}
    </span>
  );
};

export default HomePage;

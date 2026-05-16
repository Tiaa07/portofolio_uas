import { Link } from "react-router-dom";

const AboutPage = () => {
  const values = [
    {
      number: "01",
      title: "Simple Order",
      desc: "User cukup memilih template, memilih paket, mengisi data, lalu upload bukti pembayaran.",
    },
    {
      number: "02",
      title: "Admin Process",
      desc: "Admin membantu verifikasi pembayaran, mengecek data, dan memproses portfolio sampai selesai.",
    },
    {
      number: "03",
      title: "Public Link",
      desc: "Portfolio final bisa dibuka tanpa login dan dibagikan untuk kebutuhan profesional.",
    },
  ];

  return (
    <main className="overflow-hidden text-[#111827]">
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-[980px] text-center">
          <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center md:h-36 md:w-36">
            <img
              src="/images/logo.png"
              alt="Logo Build Portfolio"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
            About Build Portfolio
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em] text-[#111827]">
            Platform portfolio yang dibuat untuk proses order yang simpel.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-8 text-[#64748b] md:text-base">
            Build Portfolio membantu user membuat website portfolio profesional
            dengan alur yang mudah. User cukup memilih template, memilih paket,
            mengisi data, upload bukti pembayaran, lalu admin memproses hingga
            link portfolio final aktif dan siap dibagikan.
          </p>

          <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-2">
            <InfoItem text="Template siap pakai" />
            <InfoItem text="Paket Basic, Standard, Premium" />
            <InfoItem text="Preview sebelum final" />
            <InfoItem text="Link portfolio public" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/templates"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
            >
              Lihat Template
            </Link>

            <Link
              to="/register"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-black text-[#111827] shadow-sm transition hover:bg-[#f8fafc]"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:pb-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              Why It Works
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[clamp(30px,4vw,46px)] font-black leading-[1.05] tracking-[-0.04em] text-[#111827]">
              Dibuat agar proses pembuatan portfolio lebih jelas.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map((item, index) => (
              <article
                key={item.number}
                className={`rounded-[28px] border border-[#e5e7eb] p-6 shadow-sm ${
                  index === 0
                    ? "bg-white"
                    : index === 1
                    ? "bg-[#fff7ed]"
                    : "bg-[#eff6ff]"
                }`}
              >
                <div
                  className={`mb-6 grid h-11 w-11 place-items-center rounded-2xl text-sm font-black text-white ${
                    index === 0
                      ? "bg-[#2563eb]"
                      : index === 1
                      ? "bg-[#f97316]"
                      : "bg-[#0f172a]"
                  }`}
                >
                  {item.number}
                </div>

                <h3 className="text-xl font-black tracking-[-0.03em] text-[#111827]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#64748b]">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-14 md:py-16">
        <div className="mx-auto max-w-[980px] rounded-[30px] border border-[#e5e7eb] bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
            Ready to Build?
          </p>

          <h2 className="mt-4 text-[clamp(30px,4vw,50px)] font-black leading-[1.05] tracking-[-0.04em] text-[#111827]">
            Buat portfolio yang bisa langsung dibagikan.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#64748b] md:text-base">
            Pilih template, isi data, upload pembayaran, lalu tunggu admin
            memproses hingga link final portfolio kamu aktif.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/templates"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
            >
              Lihat Template
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-black text-[#111827] shadow-sm transition hover:bg-[#f1f5f9]"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

const InfoItem = ({ text }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-left shadow-sm">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eff6ff] text-sm font-black text-[#2563eb]">
        ✓
      </span>

      <span className="text-sm font-bold text-[#111827]">{text}</span>
    </div>
  );
};

export default AboutPage;
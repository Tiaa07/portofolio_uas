export const formatValidationMessage = (field, messages) => {
  const rawMessage = Array.isArray(messages) ? messages[0] : messages;
  const message = String(rawMessage || "");
  const lowerMessage = message.toLowerCase();
  const fieldName = formatFieldName(field);

  if (field.startsWith("project_images")) {
    if (
      lowerMessage.includes("validasi gagal") ||
      lowerMessage.includes("validation failed") ||
      lowerMessage.includes("must not be greater") ||
      lowerMessage.includes("2048")
    ) {
      return `${fieldName} tidak valid. Pastikan file berupa JPG/PNG dan ukuran maksimal 2MB.`;
    }

    return `${fieldName}: ${message || "File gambar project tidak valid."}`;
  }

  if (field.startsWith("certificate_files")) {
    if (
      lowerMessage.includes("validasi gagal") ||
      lowerMessage.includes("validation failed") ||
      lowerMessage.includes("must not be greater") ||
      lowerMessage.includes("2048")
    ) {
      return `${fieldName} tidak valid. Pastikan file berupa JPG, PNG, atau PDF dan ukuran maksimal 2MB.`;
    }

    return `${fieldName}: ${message || "File sertifikat tidak valid."}`;
  }

  if (
    lowerMessage.includes("must not be greater than 2048 kilobytes") ||
    lowerMessage.includes("2048 kilobytes")
  ) {
    return `${fieldName} maksimal berukuran 2MB. Silakan kompres atau pilih file yang lebih kecil.`;
  }

  if (lowerMessage.includes("must not be greater than")) {
    return `${fieldName} melebihi batas yang diperbolehkan.`;
  }

  if (
    lowerMessage.includes("field is required") ||
    lowerMessage.includes("required") ||
    lowerMessage.includes("wajib")
  ) {
    return `${fieldName} wajib diisi.`;
  }

  if (lowerMessage.includes("must be a valid email")) {
    return `${fieldName} harus menggunakan format email yang valid.`;
  }

  if (lowerMessage.includes("must be an image")) {
    return `${fieldName} harus berupa gambar.`;
  }

  if (lowerMessage.includes("must be a file of type")) {
    return `${fieldName} memiliki format file yang tidak didukung.`;
  }

  if (lowerMessage.includes("must be a file")) {
    return `${fieldName} harus berupa file yang valid.`;
  }

  if (lowerMessage.includes("has already been taken")) {
    return `${fieldName} sudah digunakan.`;
  }

  if (lowerMessage.includes("must be at least")) {
    return `${fieldName} terlalu pendek.`;
  }

  if (lowerMessage.includes("must be an integer")) {
    return `${fieldName} harus berupa angka.`;
  }

  if (lowerMessage.includes("must be a number")) {
    return `${fieldName} harus berupa angka.`;
  }

  if (lowerMessage.includes("must be a date")) {
    return `${fieldName} harus berupa tanggal yang valid.`;
  }

  if (lowerMessage.includes("does not match")) {
    return `${fieldName} tidak sesuai.`;
  }

  if (
    lowerMessage.includes("validasi gagal") ||
    lowerMessage.includes("validation failed")
  ) {
    return `${fieldName} tidak valid. Periksa kembali data yang kamu isi.`;
  }

  return `${fieldName}: ${message || "Data tidak valid."}`;
};

export const formatFieldName = (field = "") => {
  if (field.startsWith("project_images")) {
    const number = getFieldNumber(field);
    return number ? `Gambar project ke-${number}` : "Gambar project";
  }

  if (field.startsWith("certificate_files")) {
    const number = getFieldNumber(field);
    return number ? `File sertifikat ke-${number}` : "File sertifikat";
  }

  if (field.startsWith("skills")) {
    const number = getFieldNumber(field);
    return number ? `Keahlian ke-${number}` : "Keahlian";
  }

  if (field.startsWith("tools")) {
    const number = getFieldNumber(field);
    return number ? `Tools ke-${number}` : "Tools";
  }

  if (field.startsWith("projects")) {
    const number = getFieldNumber(field);
    return number ? `Project ke-${number}` : "Project";
  }

  if (field.startsWith("educations")) {
    const number = getFieldNumber(field);
    return number ? `Pendidikan ke-${number}` : "Pendidikan";
  }

  if (field.startsWith("experiences")) {
    const number = getFieldNumber(field);
    return number ? `Pengalaman ke-${number}` : "Pengalaman";
  }

  if (field.startsWith("certificates")) {
    const number = getFieldNumber(field);
    return number ? `Sertifikat ke-${number}` : "Sertifikat";
  }

  if (field.startsWith("achievements")) {
    const number = getFieldNumber(field);
    return number ? `Pencapaian ke-${number}` : "Pencapaian";
  }

  const labels = {
    name: "Nama",
    email: "Email",
    password: "Password",
    password_confirmation: "Konfirmasi password",

    template_id: "Template",
    paket: "Paket",

    nama_lengkap: "Nama lengkap",
    profesi: "Profesi",
    nomor_hp: "Nomor HP",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
    website: "Website",
    foto_profil: "Foto profil",
    about_me: "Tentang saya",

    skills: "Keahlian",
    tools: "Tools",
    projects: "Project",
    educations: "Pendidikan",
    experiences: "Pengalaman",
    certificates: "Sertifikat",
    achievements: "Pencapaian",

    metode_pembayaran: "Metode pembayaran",
    bank_atau_ewallet_pengirim: "Bank atau e-wallet pengirim",
    bank_pengirim: "Bank pengirim",
    nomor_pengirim: "Nomor pengirim",
    nama_pengirim: "Nama pengirim",
    jumlah_pembayaran: "Jumlah pembayaran",
    tanggal_pembayaran: "Tanggal pembayaran",
    foto_bukti_pembayaran: "Foto bukti pembayaran",

    alasan_penolakan: "Alasan penolakan",
  };

  return labels[field] || field.replaceAll("_", " ");
};

const getFieldNumber = (field) => {
  const match = field.match(/\.(\d+)/);

  if (!match) return null;

  return Number(match[1]) + 1;
};
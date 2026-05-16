import Swal from "sweetalert2";

export const showSuccessAlert = (title = "Berhasil", text = "") => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Oke",
    confirmButtonColor: "#2563eb",
    background: "#ffffff",
    color: "#111827",
  });
};

export const showErrorAlert = (title = "Gagal", text = "") => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Oke",
    confirmButtonColor: "#ef4444",
    background: "#ffffff",
    color: "#111827",
  });
};

export const showWarningAlert = (title = "Perhatian", text = "") => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "Oke",
    confirmButtonColor: "#f97316",
    background: "#ffffff",
    color: "#111827",
  });
};

export const showInfoAlert = (title = "Informasi", text = "") => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: "Oke",
    confirmButtonColor: "#2563eb",
    background: "#ffffff",
    color: "#111827",
  });
};

export const showConfirmAlert = ({
  title = "Apakah kamu yakin?",
  text = "Aksi ini akan diproses.",
  confirmButtonText = "Ya, lanjutkan",
  cancelButtonText = "Batal",
  icon = "question",
} = {}) => {
  return Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
    background: "#ffffff",
    color: "#111827",
  });
};

export const showLoadingAlert = (title = "Memproses...", text = "Mohon tunggu sebentar.") => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => {
  Swal.close();
};
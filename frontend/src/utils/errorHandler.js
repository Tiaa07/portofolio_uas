import { showErrorAlert } from "./sweetAlert";

/**
 * Handle API error from Laravel
 * @param {object} error - Axios error object
 * @returns {object} - Formatted errors
 */
export const handleApiError = (error) => {
  const response = error.response;
  
  if (!response) {
    showErrorAlert("Koneksi Gagal", "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.");
    return null;
  }

  const { status, data } = response;
  const message = data?.message || "Terjadi kesalahan pada sistem.";

  // Validation errors (422 Unprocessable Entity)
  if (status === 422 && data?.errors) {
    const errorList = Object.values(data.errors).flat();
    const errorHtml = `
      <ul style="text-align: left; margin-left: 20px; font-size: 0.9em; line-height: 1.6;">
        ${errorList.map(err => `<li>${err}</li>`).join('')}
      </ul>
    `;
    
    showErrorAlert("Validasi Gagal", errorHtml);
    return data.errors;
  }

  // Authentication errors (401 Unauthorized)
  if (status === 401) {
    showErrorAlert("Sesi Berakhir", "Sesi kamu telah berakhir. Silakan login kembali.");
    return null;
  }

  // Forbidden (403 Forbidden)
  if (status === 403) {
    showErrorAlert("Akses Ditolak", message);
    return null;
  }

  // Not Found (404 Not Found)
  if (status === 404) {
    showErrorAlert("Data Tidak Ditemukan", message);
    return null;
  }

  // Internal Server Error (500)
  if (status >= 500) {
    showErrorAlert("Server Error", "Terjadi masalah di server kami. Mohon coba lagi nanti.");
    return null;
  }

  // Default error
  showErrorAlert("Gagal", message);
  return null;
};

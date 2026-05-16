export const getResponseData = (response) => {
  return response?.data?.data || response?.data || {};
};

export const getTokenFromResponse = (response) => {
  const data = getResponseData(response);

  return (
    data.token ||
    data.access_token ||
    data.plainTextToken ||
    response?.data?.token ||
    response?.data?.access_token ||
    null
  );
};

export const getUserFromResponse = (response) => {
  const data = getResponseData(response);

  return data.user || response?.data?.user || data.data?.user || null;
};

export const getOtpFromResponse = (response) => {
  const data = getResponseData(response);

  return (
    data.otp_testing ||
    response?.data?.otp_testing ||
    data.kode_otp ||
    response?.data?.kode_otp ||
    data.otp ||
    response?.data?.otp ||
    null
  );
};

export const getErrorMessage = (error, fallback = "Terjadi kesalahan.") => {
  return error?.response?.data?.message || fallback;
};

export const getValidationErrors = (error) => {
  return error?.response?.data?.errors || {};
};
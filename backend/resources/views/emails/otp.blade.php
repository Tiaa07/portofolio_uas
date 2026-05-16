<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kode OTP Build Portfolio</title>
</head>
<body style="margin:0; padding:0; background:#f1f5f9; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9; padding:32px 14px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:28px; overflow:hidden; box-shadow:0 22px 60px rgba(15,23,42,0.14);">

                    <tr>
                        <td style="background:#0f172a; padding:34px;">
                            <div style="display:inline-block; width:54px; height:54px; line-height:54px; text-align:center; border-radius:18px; background:#ffffff; color:#2563eb; font-size:20px; font-weight:900;">
                                BP
                            </div>

                            <h1 style="margin:24px 0 0; color:#ffffff; font-size:32px; line-height:1.15;">
                                Verifikasi Akun Build Portfolio
                            </h1>

                            <p style="margin:14px 0 0; color:#cbd5e1; font-size:15px; line-height:1.8;">
                                Halo <strong style="color:#ffffff;">{{ $user->name }}</strong>, gunakan kode berikut untuk verifikasi akun kamu.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:34px;">
                            <p style="margin:0; color:#0f172a; font-size:18px; font-weight:900;">
                                Kode OTP kamu
                            </p>

                            <p style="margin:10px 0 0; color:#64748b; font-size:14px; line-height:1.8;">
                                Masukkan kode ini pada halaman verifikasi OTP. Kode hanya berlaku sementara.
                            </p>

                            <div style="margin:26px 0 0; border-radius:24px; background:#eff6ff; border:1px solid #bfdbfe; padding:28px 18px; text-align:center;">
                                <p style="margin:0 0 12px; color:#2563eb; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:1.8px;">
                                    Security Code
                                </p>

                                <div style="display:inline-block; padding:14px 22px; border-radius:20px; background:#ffffff; border:1px solid #dbeafe;">
                                    <span style="font-size:42px; line-height:1; letter-spacing:10px; color:#1d4ed8; font-weight:900;">
                                        {{ $kodeOtp }}
                                    </span>
                                </div>
                            </div>

                            <div style="margin-top:24px; padding:18px; border-radius:20px; background:#f8fafc; border:1px solid #e2e8f0;">
                                <p style="margin:0; color:#0f172a; font-size:14px; font-weight:900;">
                                    Batas waktu kode
                                </p>

                                <p style="margin:7px 0 0; color:#64748b; font-size:13px; line-height:1.7;">
                                    Kode ini berlaku sampai
                                    <strong style="color:#0f172a;">
                                    {{ \Carbon\Carbon::parse($expiredAt)->timezone('Asia/Jakarta')->format('d M Y H:i') }} WIB                                    </strong>.
                                </p>
                            </div>

                            <div style="margin-top:22px; padding:20px; border-radius:22px; background:#fff1f2; border:1px solid #fecdd3;">
                                <p style="margin:0; color:#be123c; font-size:14px; font-weight:900;">
                                    Jangan bagikan kode ini
                                </p>

                                <p style="margin:8px 0 0; color:#881337; font-size:13px; line-height:1.8;">
                                    Tim Build Portfolio tidak akan pernah meminta kode OTP kamu melalui chat, telepon, atau media sosial.
                                    Jika kamu tidak merasa melakukan verifikasi, abaikan email ini.
                                </p>
                            </div>

                            <div style="margin-top:24px; padding:20px; border-radius:22px; background:#0f172a;">
                                <p style="margin:0; color:#94a3b8; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:1.4px;">
                                    Akun tujuan
                                </p>

                                <p style="margin:9px 0 0; color:#ffffff; font-size:15px; font-weight:900;">
                                    {{ $user->email }}
                                </p>

                                <p style="margin:10px 0 0; color:#cbd5e1; font-size:13px; line-height:1.7;">
                                    Email ini dikirim otomatis oleh sistem Build Portfolio.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:24px 34px 30px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
                            <p style="margin:0; color:#0f172a; font-size:14px; font-weight:900;">
                                Build Portfolio
                            </p>

                            <p style="margin:7px 0 0; color:#64748b; font-size:12px; line-height:1.7;">
                                Platform pembuatan portfolio digital profesional.
                            </p>

                            <p style="margin:16px 0 0; color:#94a3b8; font-size:11px;">
                                © {{ date('Y') }} Build Portfolio. Email otomatis, mohon tidak dibalas.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
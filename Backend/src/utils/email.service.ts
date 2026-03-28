import nodemailer from "nodemailer";

interface ExamScores {
  listeningRaw: number;
  readingRaw: number;
  listeningScaled: number;
  readingScaled: number;
  totalScaled: number;
}

export const sendExamResultEmail = async (
  to: string,
  fullname: string,
  scores: ExamScores,
  registrationToken?: string,
  tokenExpiresAt?: Date,
) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      "[Email] EMAIL_USER or EMAIL_PASS is not configured — skipping exam result email.\n" +
      "       Copy .env.example to .env and fill in your Gmail App Password.",
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const courseUrl = registrationToken
    ? `${clientUrl}/dang-ky-khoa-hoc?token=${registrationToken}`
    : process.env.COURSE_REGISTRATION_URL || clientUrl;

  const expiryLabel = tokenExpiresAt
    ? tokenExpiresAt.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Kết quả bài thi đầu vào</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">TOEIC Listening & Reading</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px;">Xin chào <strong>${fullname}</strong>,</p>
        <p style="color: #64748b;">Cảm ơn bạn đã tham gia bài thi đầu vào. Dưới đây là kết quả của bạn:</p>

        ${expiryLabel ? `
        <div style="background: #fff7ed; border: 2px solid #fb923c; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 20px;">⏰</span>
            <span style="color: #c2410c; font-weight: bold; font-size: 15px;">Lưu ý quan trọng</span>
          </div>
          <p style="margin: 0; color: #9a3412; font-size: 14px; line-height: 1.6;">
            Link đăng ký khóa học bên dưới <strong>chỉ có hiệu lực trong 24 giờ</strong>.<br/>
            Vui lòng hoàn tất đăng ký trước <strong>${expiryLabel}</strong>.<br/>
            Sau thời gian này, link sẽ hết hạn và bạn cần liên hệ trung tâm để được hỗ trợ.
          </p>
        </div>` : ''}
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 12px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px 0 0 0;">
              <div style="color: #1e40af; font-weight: bold; font-size: 14px;">Listening</div>
              <div style="color: #1e3a8a; font-size: 28px; font-weight: bold;">${scores.listeningScaled}</div>
              <div style="color: #64748b; font-size: 12px;">${scores.listeningRaw} câu đúng</div>
            </td>
            <td style="padding: 12px 16px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 0 8px 0 0;">
              <div style="color: #059669; font-weight: bold; font-size: 14px;">Reading</div>
              <div style="color: #064e3b; font-size: 28px; font-weight: bold;">${scores.readingScaled}</div>
              <div style="color: #64748b; font-size: 12px;">${scores.readingRaw} câu đúng</div>
            </td>
          </tr>
        </table>
        
        <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <div style="color: rgba(255,255,255,0.8); font-size: 12px; font-weight: bold;">TỔNG ĐIỂM</div>
          <div style="color: white; font-size: 36px; font-weight: bold;">${scores.totalScaled}</div>
          <div style="color: rgba(255,255,255,0.7); font-size: 14px;">/ 990</div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${courseUrl}" 
             style="display: inline-block; padding: 14px 32px; background: #1e40af; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Đăng ký khóa học ngay
          </a>
          ${expiryLabel ? `<p style="color: #fb923c; font-size: 13px; margin-top: 10px;">⚠️ Link hết hạn lúc ${expiryLabel}</p>` : ''}
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">
          Email này được gửi tự động từ hệ thống English Center. Vui lòng không trả lời email này.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `Kết quả bài thi đầu vào TOEIC - ${fullname}`,
    html,
  });
};

export const sendEmail = async (options: { to: string; subject: string; html: string }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("[Email] EMAIL_USER or EMAIL_PASS is not configured");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export type CertificateRecord = {
  id: string;
  certificate_id: string;
  student_name: string;
  student_email: string;
  event_name: string;
  event_type: string;
  college_name: string;
  event_date: string;
  certificate_type: string;
  issuer_name: string;
  issuer_designation: string;
  verification_status: 'active' | 'revoked';
  issued_at: string;
  created_at: string;
};

export function verificationUrl(certificateId: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${baseUrl}/verify/${encodeURIComponent(certificateId)}`;
}

function fitText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

export async function createCertificatePdf(certificate: CertificateRecord) {
  const document = await PDFDocument.create();
  const page = document.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const serif = await document.embedFont(StandardFonts.TimesRoman);
  const gold = rgb(0.72, 0.48, 0.14);
  const green = rgb(0.04, 0.28, 0.22);
  const ink = rgb(0.12, 0.15, 0.15);

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.98, 0.97, 0.93) });
  page.drawRectangle({ x: 22, y: 22, width: width - 44, height: height - 44, borderColor: green, borderWidth: 3 });
  page.drawRectangle({ x: 31, y: 31, width: width - 62, height: height - 62, borderColor: gold, borderWidth: 1 });

  const logoPath = path.join(process.cwd(), 'public', 'Logo.jpeg');
  try {
    const logo = await document.embedJpg(await fs.readFile(logoPath));
    const scaled = logo.scale(0.18);
    page.drawImage(logo, { x: width / 2 - scaled.width / 2, y: height - 105, width: scaled.width, height: scaled.height });
  } catch {
    page.drawText('ILAI PROFESSIONAL ACADEMY', { x: 260, y: height - 86, size: 20, font: bold, color: green });
  }

  page.drawText(certificate.certificate_type.toUpperCase(), { x: certificate.certificate_type === 'Certificate of Completion' ? 235 : 220, y: height - 170, size: 25, font: bold, color: green });
  page.drawText('This certificate is proudly presented to', { x: 275, y: height - 215, size: 13, font: serif, color: ink });
  const name = fitText(certificate.student_name, 38);
  const nameWidth = bold.widthOfTextAtSize(name, 30);
  page.drawText(name, { x: width / 2 - nameWidth / 2, y: height - 265, size: 30, font: bold, color: gold });
  page.drawLine({ start: { x: 205, y: height - 280 }, end: { x: 637, y: height - 280 }, thickness: 1, color: gold });
  page.drawText('For participating in', { x: 341, y: height - 315, size: 13, font: serif, color: ink });
  const event = fitText(certificate.event_name, 64);
  const eventWidth = regular.widthOfTextAtSize(event, 17);
  page.drawText(event, { x: width / 2 - eventWidth / 2, y: height - 345, size: 17, font: bold, color: green });
  page.drawText(`organized by ILAI Professional Academy`, { x: 296, y: height - 375, size: 12, font: serif, color: ink });

  page.drawText(`Event Date: ${certificate.event_date}`, { x: 110, y: 142, size: 11, font: regular, color: ink });
  page.drawText(`College / Organization: ${fitText(certificate.college_name, 34)}`, { x: 110, y: 119, size: 11, font: regular, color: ink });
  page.drawText(`Certificate ID: ${certificate.certificate_id}`, { x: 110, y: 94, size: 10, font: regular, color: green });

  const qrDataUrl = await QRCode.toDataURL(verificationUrl(certificate.certificate_id), { margin: 1, width: 120 });
  const qrBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qr = await document.embedPng(qrBytes);
  page.drawImage(qr, { x: width - 190, y: 83, width: 112, height: 112 });
  page.drawText('Scan to verify', { x: width - 184, y: 70, size: 9, font: regular, color: ink });

  page.drawLine({ start: { x: width - 410, y: 135 }, end: { x: width - 235, y: 135 }, thickness: 1, color: ink });
  page.drawText(fitText(certificate.issuer_name, 26), { x: width - 410, y: 113, size: 11, font: bold, color: ink });
  page.drawText(fitText(certificate.issuer_designation, 30), { x: width - 410, y: 95, size: 10, font: regular, color: ink });
  page.drawText('Authorized Signatory', { x: width - 410, y: 76, size: 9, font: regular, color: green });

  return Buffer.from(await document.save());
}

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configurar el transporte usando Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // tu correo de empresa
    pass: process.env.EMAIL_PASS, // la contraseña de aplicación de 16 caracteres
  },
});

/**
 * Envía un correo electrónico con el PIN de recuperación
 * @param {string} to - Dirección de correo destino
 * @param {string} pin - PIN de verificación
 */
export async function enviarPinRecuperacion(to, pin) {
  const mailOptions = {
    from: `"Soporte CineReservas" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperación de contraseña - CineReservas",
    text: `Tu PIN de recuperación es: ${pin}. Este código expirará en 10 minutos.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Correo enviado correctamente a ${to}`);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
}

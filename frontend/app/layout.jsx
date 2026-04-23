import "./globals.css";

export const metadata = {
  title: "Lakshya Yadav | Freelance Developer & AI Engineer",
  description:
    "Premium full-stack portfolio for Lakshya Yadav featuring AI engineering, modern web systems, case studies, client inquiry flow, and recruiter-ready presentation."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}

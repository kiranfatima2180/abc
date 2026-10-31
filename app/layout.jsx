import "./globals.css";

export const metadata = {
  title: "LLM Chatbot",
  description: "A simple LLM-powered chatbot built with Next.js and deployed on Vercel."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

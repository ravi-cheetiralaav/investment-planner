import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIP Growth Calculator | Investment Planner',
  description: 'Calculate your SIP returns with inflation adjustment and step-up contributions. Plan your wealth creation journey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'INCOGNOTO — Exceptional by Design', description: 'Luxury architecture, residences and designer furniture. A new standard of living.' };
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }

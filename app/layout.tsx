import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MONE Design Lab', description: 'Experimental premium digital experiences.' };
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }

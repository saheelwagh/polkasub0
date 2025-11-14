import { Buffer } from 'buffer';
import type { AppProps } from 'next/app';

// Polyfill Buffer for the browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

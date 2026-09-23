import { redirect } from 'next/navigation';

/** Public root always serves the Privacy Policy — no API or admin clues. */
export default function HomePage() {
  redirect('/privacy');
}

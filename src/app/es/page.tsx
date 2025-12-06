import { redirect } from 'next/navigation'

// Por ahora redirige a la home principal
// Cuando se agregue más contenido en español, esta será la home ES
export default function SpanishHomePage() {
  redirect('/')
}

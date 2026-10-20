import { cofradia } from '@/content/cofradia'

export function Footer() {
  return (
    <footer className="footer">
      <img src="/assets/logos/monograma-oro-limpio.webp" width={64} height={64} alt="" />
      <p>
        {cofradia.nombre} “{cofradia.advocacion}”
        <br />
        {cofradia.ciudad}
      </p>
    </footer>
  )
}

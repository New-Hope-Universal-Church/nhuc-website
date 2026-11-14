import { ButtonLink, Container, Kicker } from '@/components/ui';

export default function NotFound() {
  return (
    <section className="bg-church">
      <Container className="flex min-h-[80vh] flex-col justify-center pt-32 pb-20">
        <Kicker light>Page not found</Kicker>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-semibold leading-tight tracking-tight text-ivory sm:text-6xl">This page has wandered off.</h1>
        <p className="mt-5 max-w-lg text-lg text-white/70">The link may be old or mistyped. Let us take you somewhere helpful.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="gold">Go home</ButtonLink>
          <ButtonLink href="/visit" variant="outline-light">Service times</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

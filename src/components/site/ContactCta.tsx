import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Section";
import { Reveal } from "./Reveal";

export function ContactCta() {
  return (
    <section className="hairline relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-4 font-display text-3xl leading-tight font-semibold text-balance sm:text-5xl">
            Have a product in mind?
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Let's turn the idea into a system that can actually ship.
          </p>
          <div className="mt-9">
            <Button asChild size="lg">
              <Link to="/contact">
                Start a Conversation <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

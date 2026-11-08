export interface CanticleProps {
  id: number;
  title: string;
  lyrics: string;
}

/** Um cântico. `id` é o número sequencial do cântico no catálogo (não há numeração impressa). */
export class Canticle {
  constructor(private readonly props: CanticleProps) {}

  get id(): number {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get lyrics(): string {
    return this.props.lyrics;
  }

  toJSON() {
    return { id: this.props.id, title: this.props.title, lyrics: this.props.lyrics };
  }
}

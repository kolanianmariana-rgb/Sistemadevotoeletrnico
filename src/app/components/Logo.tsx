import logoSrc from '../../imports/Captura_de_ecrã_2-5-2026_124858_www.design.com.jpeg';

interface LogoProps {
  className?: string;
  tolerance?: number;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="SOVE Logo"
      className={className}
    />
  );
}

export { logoSrc };

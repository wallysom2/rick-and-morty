interface PortalImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PortalImage({ src, alt, className = '' }: PortalImageProps) {
  return (
    <div className={`portal-image-container ${className}`}>
      <div className="portal-glow" />
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

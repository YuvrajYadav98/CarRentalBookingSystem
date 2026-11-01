import Image from "next/image";

// Cloudinary images go through the Next optimizer; any other https link (pasted by an admin) is served as-is,
// so arbitrary hosts never need to be whitelisted (and the optimizer can't be used as an open proxy).
export default function SafeImage({ src, alt, ...props }) {
  const optimized = typeof src === "string" && src.startsWith("https://res.cloudinary.com/");
  return <Image src={src} alt={alt} unoptimized={!optimized} {...props} />;
}

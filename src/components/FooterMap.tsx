import Image from "next/image";

// Clicking the map opens the office location in Google Maps.
const GMAPS_URL =
  "https://www.google.com/maps/place/32%C2%B005'07.1%22N+34%C2%B046'54.4%22E/@32.0834877,34.7804747,14z/data=!4m4!3m3!8m2!3d32.0853056!4d34.7817778?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYyMS4wIKXMDSoASAFQAw%3D%3D";

/**
 * Footer location map — a static dark (Hebrew) map image that opens the office
 * in Google Maps on click. Static for reliability; Google's attribution is part
 * of the image itself.
 */
export function FooterMap() {
  return (
    <a
      href={GMAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פתיחת המיקום ב-Google Maps"
      className="group relative block h-full w-full"
    >
      <Image
        src="/footer-map.jpg"
        alt="מפת המשרד — תל אביב"
        fill
        sizes="(max-width: 768px) 100vw, 340px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </a>
  );
}

const images = [
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
  "https://images.unsplash.com/photo-1501706362039-c6e80948c7d4?w=800",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
];

export default function FooterGallery() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 opacity-70 hover:opacity-100 transition">

      {images.map((image) => (
        <div
          key={image}
          className="aspect-video overflow-hidden rounded-lg"
        >
          <img
            src={image}
            alt="TransitOps"
            className="h-full w-full object-cover transition duration-500 hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}
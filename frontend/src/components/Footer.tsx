// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-8">
      &copy; {new Date().getFullYear()} ArtStore. All rights reserved.
    </footer>
  );
}

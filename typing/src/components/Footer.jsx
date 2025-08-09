export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-yellow-300 py-5 mt-auto text-center border-t border-yellow-400 shadow-inner">
      <p className="text-sm font-semibold select-none">
        &copy; {new Date().getFullYear()} Typing Speed Challenge. All rights reserved.
      </p>
    </footer>
  );
}

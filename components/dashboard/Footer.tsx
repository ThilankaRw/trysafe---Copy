import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; 2025 Trisafe. All rights reserved.
        </p>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[rgb(31,111,130)] dark:hover:text-[rgb(31,111,130)]"
              >
                Get more storage
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[rgb(31,111,130)] dark:hover:text-[rgb(31,111,130)]"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[rgb(31,111,130)] dark:hover:text-[rgb(31,111,130)]"
              >
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

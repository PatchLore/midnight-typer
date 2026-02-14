import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Midnight Typer
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center sm:text-left">
          Type to create stars in your personal cosmos. Your typing sessions generate unique celestial bodies based on your performance metrics.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/typing"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white gap-2 hover:from-blue-600 hover:to-purple-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Start Typing
          </Link>
          <Link
            href="/galaxy"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 text-white gap-2 hover:from-green-600 hover:to-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            My Galaxy
          </Link>
          <Link
            href="/cosmos-test"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Test Cosmos
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Features:</p>
          <ul className="list-disc list-inside mt-2 text-left inline-block">
            <li>Real-time WPM and accuracy tracking</li>
            <li>Star generation based on typing performance</li>
            <li>Interactive starfield visualization</li>
            <li>Session-based star collection</li>
          </ul>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

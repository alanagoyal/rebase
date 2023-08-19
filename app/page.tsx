import { siteConfig } from "@/config/site";
import AuthButton from "./auth-button";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="banner">
        <a href="https://basecase.vc/blog/building-with-the-batch">Read about how we build Rebase</a>
      </div>
      <main className="container mx-auto my-48 flex-grow">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              {siteConfig.description}
            </p>
          </div>
          <AuthButton />
        </section>
      </main>

      <footer className="text-center py-8">
        {" "}
        <div className="text-center mb-2">
          <p>
            Built with <span className="text-red-500">❤️</span> by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.authorName}
            </a>{" "}
          </p>
        </div>
      </footer>
    </div>
  );
}

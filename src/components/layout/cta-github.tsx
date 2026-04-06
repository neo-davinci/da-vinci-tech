import { Icons } from '@/components/icons';

export default function CtaGithub() {
  return (
    <a
      href="https://github.com/Kiranism/next-shadcn-dashboard-starter"
      rel="noopener noreferrer"
      target="_blank"
      className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.8rem] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <Icons.github className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Star</span>
    </a>
  );
}

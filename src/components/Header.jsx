export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-t-[3px] border-t-brand border-b border-b-stone-300/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1080px] items-center gap-2 px-3 py-2.5 sm:px-5">
        <span className="text-base font-bold tracking-tight text-brand-strong">
          Kitap Takibi
        </span>
        <span className="text-[13px] text-slate-500">
          Kişisel kitap listesi
        </span>
      </div>
    </header>
  )
}

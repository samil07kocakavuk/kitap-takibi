import { buttonClass } from './formClasses.js'

function navLinkClass(active) {
  return `rounded-md px-2.5 py-1 text-sm font-medium ${
    active
      ? 'bg-brand-soft text-brand-strong'
      : 'text-stone-600 hover:bg-white hover:text-slate-900'
  }`
}

export default function Header({ account, route, onLogout }) {
  return (
    <header className="sticky top-0 z-10 border-t-[3px] border-t-brand border-b border-b-stone-300/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center gap-2 px-3 py-2.5 sm:px-5">
        <a
          href={account ? '#/kitaplar' : '#/giris'}
          className="mr-auto text-base font-bold tracking-tight text-brand-strong"
        >
          Kitap Takibi
        </a>

        <nav className="flex flex-wrap items-center gap-1.5">
          {account ? (
            <>
              <span className="hidden max-w-[160px] truncate text-[13px] text-slate-500 sm:inline">
                {account.name}
              </span>
              <a
                href="#/kitaplar"
                className={navLinkClass(route === '/kitaplar')}
              >
                Kitaplarım
              </a>
              <a
                href="#/hesabim"
                className={navLinkClass(route === '/hesabim')}
              >
                Hesabım
              </a>
              <button
                type="button"
                className={buttonClass('ghost', 'sm')}
                onClick={onLogout}
              >
                Çıkış yap
              </button>
            </>
          ) : (
            <>
              <a href="#/giris" className={navLinkClass(route === '/giris')}>
                Giriş yap
              </a>
              <a
                href="#/kayit"
                className={buttonClass('primary', 'sm')}
              >
                Hesap oluştur
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  const t = useTranslations('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          <LanguageSelector />
        </div>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold text-center">
          {t('hero.title')}
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            {t('navigation.ebikes')}
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {t('cta.learnMore')}
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            {t('navigation.conversion')}
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {t('cta.learnMore')}
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            {t('navigation.rental')}
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {t('cta.learnMore')}
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            {t('navigation.tours')}
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {t('cta.learnMore')}
          </p>
        </div>
      </div>
    </main>
  );
}

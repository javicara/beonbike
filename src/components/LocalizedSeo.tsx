import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAlternateUrls } from '@/lib/i18n';

interface LocalizedSeoProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

const LocalizedSeo = ({ title, description, path, ogImage }: LocalizedSeoProps) => {
  const router = useRouter();
  const alternateUrls = getAlternateUrls(path);
  const canonicalUrl = `https://beonbike.pro${alternateUrls[router.locale as 'en' | 'es']}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Alternate Language URLs */}
      <link
        rel="alternate"
        href={`https://beonbike.pro${alternateUrls.en}`}
        hrefLang="en"
      />
      <link
        rel="alternate"
        href={`https://beonbike.pro${alternateUrls.es}`}
        hrefLang="es"
      />
      <link
        rel="alternate"
        href={`https://beonbike.pro${alternateUrls.en}`}
        hrefLang="x-default"
      />
    </Head>
  );
};

export default LocalizedSeo; 
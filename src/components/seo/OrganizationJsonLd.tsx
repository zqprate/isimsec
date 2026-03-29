import { JsonLd } from "./JsonLd";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "İsimSeç",
        url: "https://www.isimsec.com",
        description:
          "Çok dilli, interaktif bebek ismi keşif platformu. 13.000+ isim, 4 dilde anlamları, kökenleri ve popülerlik bilgileri.",
        foundingDate: "2026",
        numberOfEmployees: {
          "@type": "QuantitativeValue",
          value: 1,
        },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "İsimSeç",
        url: "https://www.isimsec.com",
        description:
          "Bebek ismi keşif platformu — 13.000+ isim, 4 dil, interaktif araçlar",
        inLanguage: ["tr", "en", "de", "ar"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://www.isimsec.com/tr/isimler?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function DatasetJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "İsimSeç Bebek İsmi Veritabanı",
        description:
          "13.000+ bebek ismi, anlamları, kökenleri, popülerlik verileri ve kültürel notları içeren çok dilli veritabanı.",
        url: "https://www.isimsec.com",
        keywords: [
          "bebek isimleri",
          "baby names",
          "isim anlamları",
          "name meanings",
          "Babynamen",
          "أسماء أطفال",
        ],
        creator: {
          "@type": "Organization",
          name: "İsimSeç",
        },
        temporalCoverage: "2020/..",
        spatialCoverage: {
          "@type": "Place",
          name: "Global",
        },
        variableMeasured: [
          "İsim anlamı",
          "Köken",
          "Popülerlik sıralaması",
          "Hece sayısı",
        ],
        distribution: {
          "@type": "DataDownload",
          contentUrl: "https://www.isimsec.com/tr/isimler",
          encodingFormat: "text/html",
        },
      }}
    />
  );
}

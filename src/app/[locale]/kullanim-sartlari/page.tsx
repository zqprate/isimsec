import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları | İsimSeç",
  description: "İsimSeç kullanım şartları. Site kullanım koşulları, sorumluluklar ve yasal bilgiler.",
};

export default function TermsPage() {
  return (
    <main className="pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-slate prose-headings:font-display prose-headings:text-ocean-800">
        <h1>Kullanım Şartları</h1>
        <p className="text-sm text-slate-400">Son güncelleme: Mart 2026</p>

        <h2>1. Hizmet Tanımı</h2>
        <p>
          İsimSeç (www.isimsec.com), bebek ismi araştırması yapan kullanıcılara
          isim veritabanı, interaktif araçlar ve bilgilendirici içerik sunan
          ücretsiz bir web platformudur.
        </p>

        <h2>2. Kullanım Koşulları</h2>
        <p>İsimSeç&apos;i kullanarak aşağıdaki koşulları kabul etmiş olursunuz:</p>
        <ul>
          <li>Siteyi yasal ve etik amaçlarla kullanmak</li>
          <li>Site içeriğini izinsiz kopyalamamak veya dağıtmamak</li>
          <li>Otomatik veri toplama araçları (scraping) kullanmamak</li>
          <li>Sitenin güvenliğini tehlikeye atacak eylemlerden kaçınmak</li>
        </ul>

        <h2>3. İçerik ve Veri Kaynakları</h2>
        <p>
          İsimSeç veritabanındaki bilgiler, TÜİK nüfus verileri, SSA Baby Names,
          BehindTheName ve Wikipedia gibi güvenilir kaynaklardan derlenmektedir.
          Ancak bilgilerin mutlak doğruluğu garanti edilmez.
        </p>
        <p>
          İsim seçimi kişisel bir karardır. İsimSeç yalnızca bilgilendirme amaçlı
          hizmet verir ve kullanıcıların verdikleri isim kararlarından sorumlu değildir.
        </p>

        <h2>4. İnteraktif Araçlar</h2>
        <p>
          Soyadı uyum analizi, isim kombinator ve ebeveyn uyumu gibi araçlar
          matematiksel algoritmalara dayalı eğlenceli tahminler sunar. Sonuçlar
          bilimsel veya dilbilimsel kesinlik iddiası taşımaz.
        </p>

        <h2>5. Fikri Mülkiyet</h2>
        <p>
          İsimSeç&apos;in tasarımı, logosu, içerikleri ve yazılım kodu telif hakkı ile
          korunmaktadır. İzinsiz kullanım yasaktır.
        </p>

        <h2>6. Reklam</h2>
        <p>
          İsimSeç, hizmetini sürdürmek için Google AdSense reklamları
          gösterebilir. Reklam içerikleri üçüncü taraf reklamverenler tarafından
          sağlanır ve İsimSeç&apos;in onayını yansıtmaz.
        </p>

        <h2>7. Sorumluluk Sınırı</h2>
        <p>
          İsimSeç, siteyi &ldquo;olduğu gibi&rdquo; sunar. Hizmetin kesintisiz veya
          hatasız olacağını garanti etmez. Kullanımdan kaynaklanan doğrudan veya
          dolaylı zararlardan sorumlu tutulamaz.
        </p>

        <h2>8. Değişiklikler</h2>
        <p>
          Bu kullanım şartları önceden bildirim yapılmaksızın güncellenebilir.
          Güncel versiyona her zaman bu sayfadan erişebilirsiniz.
        </p>

        <h2>9. İletişim</h2>
        <p>
          Kullanım şartları hakkında sorularınız için iletişim sayfamızdan bize
          ulaşabilirsiniz.
        </p>
      </article>
    </main>
  );
}

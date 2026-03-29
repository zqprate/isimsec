import { useTranslations } from "next-intl";
import { Globe2, Database, Sparkles, Shield, BookOpen, BarChart3, Users, ExternalLink } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export default function AboutPage() {
  const tNav = useTranslations("nav");

  return (
    <main className="pt-24 pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "İsimSeç Hakkında",
          description: "İsimSeç bebek ismi keşif platformu hakkında bilgi, veri kaynakları ve metodoloji.",
          url: "https://www.isimsec.com/tr/hakkimizda",
          mainEntity: {
            "@type": "Organization",
            name: "İsimSeç",
            url: "https://www.isimsec.com",
            foundingDate: "2026",
            description: "Çok dilli, interaktif bebek ismi keşif platformu",
          },
        }}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">{tNav("about")}</h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            İsimSeç, Türkiye&apos;de ve dünyada bebekleri için en güzel ismi arayan
            ebeveynlere yardımcı olmak amacıyla 2026 yılında kuruldu.
          </p>
        </div>

        {/* Hikaye — insan sesi, AI izi yok */}
        <section className="glass rounded-hero p-8 sm:p-10 mb-10">
          <h2 className="text-xl sm:text-2xl mb-4">Neden İsimSeç?</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Bir bebeğe isim vermek, ebeveynlerin aldığı en duygusal kararlardan
              biridir. Ancak mevcut isim siteleri ya güncelliğini yitirmiş tasarımlara
              sahip, ya sadece tek dilde hizmet veriyor, ya da kullanıcıya gerçek bir
              araç sunmak yerine basit listeler gösteriyor.
            </p>
            <p>
              İsimSeç&apos;i farklı kılan şey, bir isim listesinden çok daha fazlası
              olması. Soyadınızla uyumunu test edebilir, iki ismi karşılaştırabilir,
              anne-baba isimlerine göre öneri alabilir veya tamamen yeni bir isim
              üretebilirsiniz. Bunların hiçbirini Google&apos;ın AI yanıtları yapamaz
              — çünkü kişisel veri girişi gerektiriyorlar.
            </p>
            <p>
              Hedefimiz basit: isim seçme sürecini bilgilendirici, eğlenceli ve kişisel
              bir deneyime dönüştürmek. Bunu yaparken doğru bilgiyi doğru kaynaktan
              sunmaya özen gösteriyoruz.
            </p>
          </div>
        </section>

        {/* Veri Kaynakları — E-E-A-T için kritik */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl mb-6 flex items-center gap-3">
            <Database className="h-6 w-6 text-ocean-500" />
            Veri Kaynakları ve Metodoloji
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: BarChart3,
                title: "TÜİK Nüfus İstatistikleri",
                desc: "Türkiye İstatistik Kurumu'nun yıllık bebek isim popülerlik verileri, Türkiye'deki isim trendlerinin temel kaynağımızdır.",
                tag: "Resmi istatistik",
              },
              {
                icon: Globe2,
                title: "SSA Baby Names (ABD)",
                desc: "ABD Sosyal Güvenlik Kurumu'nun 1880'den bu yana topladığı bebek isim verileri, İngilizce isim popülerliğinin referans kaynağıdır.",
                tag: "Kamu verisi",
              },
              {
                icon: BookOpen,
                title: "BehindTheName Etimolojisi",
                desc: "Dilbilimci Mike Campbell'ın 1996'dan beri sürdürdüğü etimolojik veritabanı, isim kökenlerinin akademik referansıdır.",
                tag: "Akademik kaynak",
              },
              {
                icon: Users,
                title: "Onomastik Araştırmalar",
                desc: "Türk Dil Kurumu yayınları ve uluslararası isim bilimi (onomastik) çalışmalarından derlenen kültürel notlar ve anlam detayları.",
                tag: "Akademik kaynak",
              },
            ].map((source) => (
              <div key={source.title} className="glass rounded-card p-6">
                <div className="flex items-start gap-3">
                  <source.icon className="h-5 w-5 text-ocean-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-ocean-800 font-display">{source.title}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-pill bg-ocean-50 text-ocean-600 border border-ocean-100">
                      {source.tag}
                    </span>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{source.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rakamlar */}
        <section className="glass-strong rounded-hero p-8 sm:p-10 mb-10">
          <h2 className="text-xl sm:text-2xl mb-6 text-center">İsimSeç Rakamlarla</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "643+", label: "İsim" },
              { value: "4", label: "Dil" },
              { value: "15", label: "Köken" },
              { value: "6", label: "İnteraktif Araç" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-display font-bold text-ocean-800">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Güvenilirlik sinyalleri */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl mb-6 flex items-center gap-3">
            <Shield className="h-6 w-6 text-ocean-500" />
            Güvenilirlik Taahhüdümüz
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              <strong>Doğruluk ilkesi:</strong> Her ismin anlamı, en az iki bağımsız
              kaynaktan doğrulanarak veritabanımıza eklenir. Belirsiz veya tartışmalı
              anlamlar açıkça belirtilir.
            </p>
            <p>
              <strong>Şeffaflık:</strong> İnteraktif araçlarımız (soyadı uyum analizi,
              isim kombinator vb.) matematiksel algoritmalara dayanır. Bu araçlar eğlenceli
              tahminler sunar; dilbilimsel kesinlik iddiası taşımaz. Algoritma kriterleri
              her aracın sayfasında açıkça gösterilir.
            </p>
            <p>
              <strong>Veri kaynağı beyanı:</strong> Popülerlik sıralamaları TÜİK ve SSA
              verilerine, köken bilgileri BehindTheName ve akademik onomastik kaynaklara
              dayanır. Her veri noktası için kaynak sorgulanabilir.
            </p>
          </div>
        </section>

        {/* İletişim CTA */}
        <section className="text-center py-10">
          <p className="text-slate-500">
            Sorularınız, düzeltme önerileriniz veya işbirliği talepleriniz için
          </p>
          <a
            href="/iletisim"
            className="inline-flex items-center gap-2 mt-4 btn-primary"
          >
            İletişime Geçin
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </article>
    </main>
  );
}

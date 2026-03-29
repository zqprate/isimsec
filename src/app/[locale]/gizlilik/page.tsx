import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | İsimSeç",
  description: "İsimSeç gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
};

export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-slate prose-headings:font-display prose-headings:text-ocean-800">
        <h1>Gizlilik Politikası</h1>
        <p className="text-sm text-slate-400">Son güncelleme: Mart 2026</p>

        <h2>1. Toplanan Veriler</h2>
        <p>
          İsimSeç (www.isimsec.com), kullanıcı deneyimini iyileştirmek amacıyla
          aşağıdaki verileri toplayabilir:
        </p>
        <ul>
          <li><strong>Çerezler ve oturum bilgileri:</strong> Favori isimlerinizi hatırlamak için tarayıcınıza bir oturum kimliği atanır. Bu kimlik kişisel bilgilerinizi içermez.</li>
          <li><strong>Kullanım verileri:</strong> Google Analytics 4 aracılığıyla anonim sayfa görüntüleme, cihaz tipi ve tarayıcı bilgileri toplanır.</li>
          <li><strong>İletişim bilgileri:</strong> İletişim formunu kullandığınızda gönüllü olarak paylaştığınız ad, e-posta ve mesaj içeriği.</li>
        </ul>

        <h2>2. Verilerin Kullanımı</h2>
        <p>Toplanan veriler yalnızca aşağıdaki amaçlarla kullanılır:</p>
        <ul>
          <li>Site işlevselliğinin sağlanması (favoriler, dil tercihi)</li>
          <li>Site performansının ve kullanıcı deneyiminin iyileştirilmesi</li>
          <li>İletişim taleplerine yanıt verilmesi</li>
          <li>İstatistiksel analiz (anonim ve toplu veriler)</li>
        </ul>

        <h2>3. Üçüncü Taraf Hizmetler</h2>
        <ul>
          <li><strong>Google Analytics 4:</strong> Anonim kullanım istatistikleri</li>
          <li><strong>Google AdSense:</strong> Kişiselleştirilmiş veya genel reklamlar (ileride)</li>
          <li><strong>Vercel:</strong> Hosting ve CDN hizmeti</li>
          <li><strong>Supabase:</strong> Veritabanı altyapısı (AB bölgesinde barındırılır)</li>
        </ul>

        <h2>4. Çerezler</h2>
        <p>
          İsimSeç, temel site işlevleri ve analiz için çerez kullanır. Tarayıcı
          ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu bazı
          özelliklerin çalışmamasına neden olabilir.
        </p>

        <h2>5. Veri Güvenliği</h2>
        <p>
          Verilerinizi korumak için endüstri standardı güvenlik önlemleri
          kullanıyoruz. Tüm veri iletişimi HTTPS ile şifrelenir. Kişisel
          verileriniz üçüncü şahıslarla paylaşılmaz veya satılmaz.
        </p>

        <h2>6. Haklarınız</h2>
        <p>KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Verilerinize erişim talep etme</li>
          <li>Verilerinizin düzeltilmesini isteme</li>
          <li>Verilerinizin silinmesini talep etme</li>
          <li>Veri işlemeye itiraz etme</li>
        </ul>
        <p>
          Bu haklarınızı kullanmak için iletişim sayfamızdan bize ulaşabilirsiniz.
        </p>

        <h2>7. İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız için iletişim sayfamızdan
          bize ulaşabilirsiniz.
        </p>
      </article>
    </main>
  );
}

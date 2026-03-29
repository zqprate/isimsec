import { useTranslations } from "next-intl";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const tNav = useTranslations("nav");

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl">{tNav("contact")}</h1>
          <p className="mt-4 text-slate-500 text-lg">
            Soru, öneri veya geri bildirimleriniz için bize ulaşın.
          </p>
        </div>

        <div className="glass-strong rounded-hero p-8 sm:p-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Ad Soyad</label>
            <input type="text" className="input-glass w-full h-12 px-4" placeholder="Adınız Soyadınız" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">E-posta</label>
            <input type="email" className="input-glass w-full h-12 px-4" placeholder="ornek@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Mesajınız</label>
            <textarea className="input-glass w-full px-4 py-3 min-h-[120px] resize-y" placeholder="Mesajınızı yazın..." />
          </div>
          <button className="btn-primary w-full">
            <Mail className="h-4 w-4" />
            Gönder
          </button>
        </div>
      </div>
    </main>
  );
}

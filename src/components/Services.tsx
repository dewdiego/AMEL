import {
  ClipboardCheck, Headset, Users, FileText, Calculator, Scale, FolderArchive,
  type LucideIcon,
} from 'lucide-react';
import { SERVICES } from '@/data';

const iconMap: Record<string, LucideIcon> = {
  ClipboardCheck,
  Headset,
  Users,
  FileText,
  Calculator,
  Scale,
  FolderArchive,
};

export default function Services() {
  return (
    <section id="servicios" className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[2px] uppercase font-bold text-blue-900 mb-3">
            Administración de consorcios &gt; Servicios
          </p>
          <div className="w-16 h-0.5 bg-blue-900 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
            Nuestros <span className="font-bold">servicios</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => {
            const Icon = iconMap[svc.icon] ?? FileText;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-900 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-blue-900 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{svc.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{svc.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

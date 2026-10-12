import { TRAMOS, type ClaseConsorcio } from '@/data';

export const IVA = 0.21;
export const PROMO_DESCUENTO = 0.2;
export const PROMO_MESES = 3;

export interface Linea {
  label: string;
  uf: number;
  valor: number;
  subtotal: number;
}

export interface Resultado {
  ufTotales: number;
  lineas: Linea[];
  neto: number;
  aviso?: string;
}

/**
 * Método CAPHyAI: mínimo de la clase hasta 20 UF; el excedente se valoriza
 * por tramos (21-40, 41-50, ...). Cocheras y bauleras = 0,5 UF.
 */
export function calcularHonorario(
  clase: ClaseConsorcio,
  unidades: number,
  complementarias: number,
): Resultado {
  const ufTotales = Math.max(0, unidades) + Math.max(0, complementarias) * 0.5;

  // A2: valor fijo para complejos de 200 UF o más
  if (clase.porUF.length === 0) {
    return {
      ufTotales,
      lineas: [{ label: `Mínimo hasta ${clase.minimoHastaUF} UF`, uf: Math.min(ufTotales, clase.minimoHastaUF), valor: clase.minimo, subtotal: clase.minimo }],
      neto: clase.minimo,
      aviso:
        ufTotales < clase.minimoHastaUF
          ? 'La Clase A2 aplica a complejos de 200 UF o más. Para menos unidades usá la Clase A1.'
          : ufTotales > clase.minimoHastaUF
            ? 'Para complejos de más de 200 UF el excedente se cotiza a medida.'
            : undefined,
    };
  }

  const lineas: Linea[] = [
    { label: `Mínimo hasta ${clase.minimoHastaUF} UF`, uf: Math.min(ufTotales, clase.minimoHastaUF), valor: clase.minimo, subtotal: clase.minimo },
  ];

  TRAMOS.forEach((t, i) => {
    const inicio = t.desde - 1; // UF ya cubiertas antes del tramo
    const uf = Math.min(ufTotales, t.hasta) - inicio;
    if (uf > 0) {
      const valor = clase.porUF[i];
      lineas.push({ label: `UF ${t.label}`, uf, valor, subtotal: uf * valor });
    }
  });

  return { ufTotales, lineas, neto: lineas.reduce((s, l) => s + l.subtotal, 0) };
}

export const pesos = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export const ufFmt = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 1 });

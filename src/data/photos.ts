import academic from '../assets/personal/ambiente-academico.jpg';
import campus from '../assets/personal/en-el-campus.jpg';
import casual from '../assets/personal/joan-roa-casual.jpg';
import portrait from '../assets/personal/joan-roa-retrato.png';

/** Fotografías aportadas y aprobadas por el propietario para Feature10. */
export const personalPhotos = {
  casual: {
    src: casual,
    alt: 'Joan Roa con chaqueta verde y gafas de sol frente a una fachada de ladrillo.',
    caption: 'Fuera de la pantalla.',
    position: '50% 25%',
  },
  portrait: {
    src: portrait,
    alt: 'Retrato de Joan Roa con gafas, traje oscuro y corbata azul.',
    caption: 'Joan Ricardo Roa Mora',
    position: '50% 35%',
  },
  campus: {
    src: campus,
    alt: 'Joan Roa al aire libre, con gafas de sol y chaqueta negra, junto a un edificio de ladrillo y columnas blancas.',
    caption: 'En el campus',
    position: '50% 50%',
  },
  academic: {
    src: academic,
    alt: 'Joan Roa con gafas y camisa clara junto a un panel de portadas y recortes de prensa.',
    caption: 'Ambiente académico',
    position: '50% 50%',
  },
} as const;

export type PersonalPhotoId = keyof typeof personalPhotos;

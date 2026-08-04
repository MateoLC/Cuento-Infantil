import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePrivacy } from '../privacy/usePrivacy';

const LAST_UPDATED = '4 de agosto de 2026';

function PrivacyContent() {
  const { openPrivacyPreferences } = usePrivacy();

  return (
    <>
      <p>
        Esta política explica cómo el proyecto educativo <strong>Sofía, un verdadero cuento ecológico</strong> trata la
        información asociada al sitio web y sus actividades. El canal de atención disponible es WhatsApp al{' '}
        <a href="https://wa.me/573134536499" target="_blank" rel="noreferrer">+57 313 453 6499</a>.
      </p>

      <h2>1. Información necesaria</h2>
      <p>
        El navegador puede guardar preferencias de privacidad, avances de juegos y datos funcionales del pasaporte del
        explorador. Este almacenamiento local permite que las actividades funcionen y no se utiliza para publicidad.
      </p>

      <h2>2. Estadísticas opcionales</h2>
      <p>
        Únicamente después de recibir autorización guardamos en el navegador identificadores aleatorios de visitante y de
        sesión. El servidor transforma esos identificadores mediante una función criptográfica irreversible y registra la ruta
        visitada y la fecha. El contador no identifica personas por su dirección IP, no crea una huella digital del dispositivo
        y no realiza seguimiento en otros sitios. La infraestructura puede conservar registros técnicos temporales por motivos
        de seguridad.
      </p>

      <h2>3. Contador de exploradores</h2>
      <p>
        La cifra pública es un total aproximado y acumulado de navegadores que autorizaron las estadísticas. Varias personas
        que compartan un dispositivo pueden contarse como un explorador, mientras que dispositivos distintos conectados al
        mismo WiFi pueden contarse por separado. Recargar una página no suma un nuevo explorador.
      </p>

      <h2>4. Conservación y retiro</h2>
      <p>
        Los identificadores anónimos del servidor se eliminan después de 12 meses de inactividad. El total histórico agregado
        puede conservarse porque ya no permite identificar un navegador. Puedes retirar la autorización y borrar el
        identificador activo desde este botón:
      </p>
      <button type="button" onClick={openPrivacyPreferences} className="legal-action">Configurar privacidad</button>

      <h2>5. Clasificación y nombres públicos</h2>
      <p>
        La tabla de clasificación publica el alias escogido y los puntos. Recomendamos no utilizar nombres completos, datos de
        contacto, colegio, ubicación ni otra información personal. Aplicamos filtros de lenguaje y pueden retirarse alias o
        registros inapropiados. Las solicitudes de corrección o eliminación pueden hacerse por el canal de atención.
      </p>

      <h2>6. Niños, niñas y adolescentes</h2>
      <p>
        El proyecto está dirigido a familias y comunidades educativas. La autorización de estadísticas debe ser tomada por un
        adulto responsable, respetando el interés superior y los derechos de los niños. Las actividades no solicitan correo,
        teléfono, dirección ni ubicación de los menores.
      </p>

      <h2>7. Derechos y marco aplicable</h2>
      <p>
        Puedes solicitar acceso, actualización, corrección, eliminación o revocatoria cuando corresponda. Esta política toma
        como referencia la Ley 1581 de 2012 y las orientaciones de la Superintendencia de Industria y Comercio.
      </p>
      <p className="legal-sources">
        <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981" target="_blank" rel="noreferrer">
          Consultar Ley 1581 <ExternalLink size={14} />
        </a>
        <a href="https://sedeelectronica.sic.gov.co/politica-de-tratamiento-de-datos-personales" target="_blank" rel="noreferrer">
          Orientación de la SIC <ExternalLink size={14} />
        </a>
      </p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p>
        Estos términos regulan el uso del sitio de <strong>Sofía, un verdadero cuento ecológico</strong>, sus contenidos y
        actividades educativas. Al utilizarlo, la persona usuaria acepta hacerlo de manera respetuosa y conforme a la ley.
      </p>

      <h2>1. Finalidad educativa</h2>
      <p>
        El sitio ofrece contenidos sobre biodiversidad, un libro digital y juegos de aprendizaje. No reemplaza la orientación
        de docentes, familias ni profesionales. Los menores deben usar las funciones públicas con acompañamiento de un adulto.
      </p>

      <h2>2. Pasaporte y clasificación</h2>
      <p>
        Los puntos son recreativos y no tienen valor económico. Los alias públicos no deben incluir nombres completos, datos
        personales, lenguaje ofensivo ni suplantar a terceros. Podemos moderar o retirar registros que incumplan estas reglas.
      </p>

      <h2>3. Uso permitido</h2>
      <p>
        No está permitido interferir con el servicio, automatizar puntuaciones, intentar acceder a información ajena, eludir
        controles de seguridad o reutilizar el contenido con fines comerciales sin autorización.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        El libro, las ilustraciones, marcas, textos, juegos y demás recursos pertenecen a sus respectivos titulares. El acceso
        al sitio no transfiere derechos de propiedad ni autoriza reproducciones distintas de las permitidas expresamente.
      </p>

      <h2>5. Disponibilidad y cambios</h2>
      <p>
        Procuramos mantener el servicio disponible y actualizado, pero pueden presentarse interrupciones, correcciones o
        cambios. Las modificaciones importantes de estos términos se publicarán en esta página con su fecha de actualización.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para reportar un problema, solicitar la revisión de un alias o formular una petición, escribe por WhatsApp al{' '}
        <a href="https://wa.me/573134536499" target="_blank" rel="noreferrer">+57 313 453 6499</a>.
      </p>
    </>
  );
}

export default function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';

  return (
    <main className="min-h-screen bg-[#f7f3e9] px-5 py-12 md:py-16">
      <article className="legal-page mx-auto max-w-4xl">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-black text-[#315b35] hover:text-[#173c24]">
          <ArrowLeft size={18} /> Volver al inicio
        </Link>
        <p className="text-sm font-black uppercase tracking-widest text-[#749d32]">
          {isPrivacy ? 'Protección de datos' : 'Uso del sitio'}
        </p>
        <h1>{isPrivacy ? 'Política de privacidad' : 'Términos y condiciones'}</h1>
        <p className="legal-date">Última actualización: {LAST_UPDATED}</p>
        {isPrivacy ? <PrivacyContent /> : <TermsContent />}
      </article>
    </main>
  );
}

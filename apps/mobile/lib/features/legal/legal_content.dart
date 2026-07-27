/// Placeholder copy for the static Legal/Help screens (see
/// `StaticInfoPage`) — until the business supplies the real text, this
/// keeps every entry point (drawer, Settings) pointing at something
/// real instead of a dead link.
abstract final class LegalContent {
  static const String termsTitle = 'Términos y condiciones';
  static const String terms = '''
Estos Términos y Condiciones regulan el uso de la aplicación SERVICIOS 180°. Al registrarte y usar la app, aceptas cumplirlos.

1. Objeto: la aplicación conecta a personas que solicitan servicios con profesionales independientes que los ofrecen. SERVICIOS 180° actúa como intermediario y no es parte del servicio contratado entre cliente y proveedor.

2. Cuentas: eres responsable de la información que registras y de mantener la confidencialidad de tus credenciales de acceso.

3. Uso adecuado: no está permitido usar la aplicación para fines ilícitos, fraudulentos o que afecten a otros usuarios.

4. Responsabilidad: SERVICIOS 180° no garantiza la calidad final del servicio prestado por terceros, aunque facilita mecanismos de calificación y reporte.

5. Modificaciones: estos términos pueden actualizarse; el uso continuado de la app implica la aceptación de los cambios.

(Texto provisional — pendiente de revisión legal definitiva.)
''';

  static const String privacyTitle = 'Política de privacidad';
  static const String privacy = '''
En SERVICIOS 180° respetamos tu privacidad y protegemos tus datos personales.

1. Datos que recopilamos: información de registro (nombre, documento, contacto), datos de uso de la aplicación y, cuando lo autorizas, tu ubicación para mostrarte servicios cercanos.

2. Uso de los datos: utilizamos tu información para prestarte el servicio, verificar tu identidad, procesar solicitudes y mejorar la experiencia de la aplicación.

3. Compartición: no vendemos tus datos personales. Solo se comparten con el proveedor/cliente correspondiente lo estrictamente necesario para completar un servicio.

4. Seguridad: aplicamos medidas técnicas razonables para proteger tu información contra accesos no autorizados.

5. Tus derechos: puedes solicitar la actualización o eliminación de tus datos personales desde Configuración o contactando a soporte.

(Texto provisional — pendiente de revisión legal definitiva.)
''';

  static const String helpTitle = 'Ayuda y soporte';
  static const String help = '''
¿Necesitas ayuda? Aquí tienes algunas respuestas rápidas:

• ¿Cómo solicito un servicio? Ve a la pestaña "Buscar", elige una categoría o escribe lo que necesitas, y selecciona un proveedor.

• ¿Cómo cambio mi contraseña? Ve a Configuración → Seguridad.

• ¿Cómo reporto un problema con un servicio? Desde el detalle de la orden en "Órdenes" (próximamente) o escribiéndonos directamente.

• ¿Cómo contacto al soporte? Escríbenos a soporte@servicios180.com (correo de referencia, sujeto a confirmación del negocio).

Seguimos trabajando para traerte más opciones de autoayuda directamente desde la app.
''';

  static const String aboutTitle = 'Acerca de';
  static const String aboutBody = '''
SERVICIOS 180°

Conectamos personas que necesitan un servicio con profesionales de confianza, todo desde una sola aplicación.

Versión 1.0.0
''';
}

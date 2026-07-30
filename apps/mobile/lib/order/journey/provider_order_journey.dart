import '../entities/order.dart';
import '../models/order_status.dart';
import '../../quote/entities/quote.dart';
import 'order_journey_action.dart';
import 'order_journey_info.dart';
import 'order_journey_stage.dart';

/// Derives "what's happening and what can I do" for a provider looking
/// at one `Order` relevant to them (directly hired, or an open request
/// in their category) — the provider-side mirror of
/// `ClientOrderJourney`. Pure function of already-fetched data: `order`,
/// this provider's own `myQuote` for it (`null` if they haven't
/// submitted one yet), and whether the client already `hasReviewed` it.
abstract final class ProviderOrderJourney {
  static OrderJourneyInfo derive({
    required Order order,
    required Quote? myQuote,
    required bool hasReviewed,
  }) {
    switch (order.status) {
      case OrderStatus.cancelled:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.requested,
          title: 'Solicitud cancelada',
          description: 'El cliente canceló esta solicitud.',
          helpMessage: '',
          actions: [],
          cancelled: true,
        );
      case OrderStatus.rejected:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.requested,
          title: 'Solicitud rechazada',
          description: 'Esta solicitud ya no está disponible.',
          helpMessage: '',
          actions: [],
          cancelled: true,
        );

      case OrderStatus.pending:
        if (myQuote == null) {
          return OrderJourneyInfo(
            stage: OrderJourneyStage.requested,
            title: order.isDirectHire
                ? 'Solicitud directa disponible'
                : 'Nueva solicitud abierta',
            description: order.isDirectHire
                ? 'Un cliente te solicitó directamente. Envía tu cotización para confirmar el servicio.'
                : 'Hay una solicitud abierta en tu categoría. Envía una cotización para competir por ella.',
            helpMessage: 'El cliente comparará tu cotización con las demás antes de decidir.',
            actions: const [
              OrderJourneyAction(OrderJourneyActionKind.submitQuote, 'Enviar cotización'),
            ],
          );
        }
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.quotesReceived,
          title: 'Cotización enviada',
          description: 'Ya enviaste tu cotización para esta solicitud. Estás esperando la respuesta del cliente.',
          helpMessage: 'Te avisaremos aquí en cuanto el cliente decida.',
          actions: [],
        );

      case OrderStatus.accepted:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.scheduled,
          title: 'Servicio programado',
          description: 'El cliente aceptó tu cotización. Prepárate para iniciar el servicio en la fecha acordada.',
          helpMessage: 'Puedes escribirle por chat para coordinar cualquier detalle antes de empezar.',
          actions: [
            OrderJourneyAction(OrderJourneyActionKind.openChat, 'Abrir chat'),
            OrderJourneyAction(OrderJourneyActionKind.startService, 'Iniciar servicio'),
          ],
        );

      case OrderStatus.inProgress:
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.inProgress,
          title: 'Servicio en ejecución',
          description: 'Marca el servicio como finalizado cuando termines el trabajo.',
          helpMessage: '',
          actions: [
            OrderJourneyAction(OrderJourneyActionKind.openChat, 'Abrir chat'),
            OrderJourneyAction(OrderJourneyActionKind.completeService, 'Marcar como finalizado'),
          ],
        );

      case OrderStatus.completed:
        if (hasReviewed) {
          return const OrderJourneyInfo(
            stage: OrderJourneyStage.done,
            title: 'Trabajo completado',
            description: 'El cliente calificó este servicio.',
            helpMessage: '',
            actions: [],
          );
        }
        return const OrderJourneyInfo(
          stage: OrderJourneyStage.awaitingRating,
          title: 'Esperando calificación',
          description: 'Marcaste este servicio como finalizado. El cliente todavía no lo ha calificado.',
          helpMessage: '',
          actions: [],
        );
    }
  }
}

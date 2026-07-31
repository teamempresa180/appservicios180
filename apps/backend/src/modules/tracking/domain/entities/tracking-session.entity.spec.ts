import { TrackingSession } from './tracking-session.entity';
import { TrackingSessionId } from '../value-objects/tracking-session-id.value-object';
import { TrackingSessionStatus } from '../value-objects/tracking-session-status.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

describe('TrackingSession', () => {
  it('holds all the assigned properties', () => {
    const id = TrackingSessionId.create();
    const orderId = OrderId.create();
    const providerId = ProviderId.create();
    const startedAt = new Date();

    const session = new TrackingSession(id, {
      orderId,
      providerId,
      status: TrackingSessionStatus.Active,
      startedAt,
    });

    expect(session.id).toBe(id);
    expect(session.orderId).toBe(orderId);
    expect(session.providerId).toBe(providerId);
    expect(session.status).toBe(TrackingSessionStatus.Active);
    expect(session.startedAt).toBe(startedAt);
  });

  it('allows a null startedAt while notStarted', () => {
    const session = new TrackingSession(TrackingSessionId.create(), {
      orderId: OrderId.create(),
      providerId: ProviderId.create(),
      status: TrackingSessionStatus.NotStarted,
      startedAt: null,
    });

    expect(session.startedAt).toBeNull();
    expect(session.status).toBe(TrackingSessionStatus.NotStarted);
  });

  it('is equal to another session with the same id', () => {
    const id = TrackingSessionId.create();
    const orderId = OrderId.create();
    const providerId = ProviderId.create();
    const build = () =>
      new TrackingSession(id, {
        orderId,
        providerId,
        status: TrackingSessionStatus.Ended,
        startedAt: new Date(),
      });

    expect(build().equals(build())).toBe(true);
  });
});

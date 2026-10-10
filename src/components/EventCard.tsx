import type { FestEvent } from "../data/events";
import { Icon } from "./Icon";

export function EventCard({
  event,
  seatsLeft,
  onRegister,
}: {
  event: FestEvent;
  seatsLeft: number;
  onRegister: () => void;
}) {
  const percentAvailable = Math.round((seatsLeft / event.capacity) * 100);
  const isFull = seatsLeft === 0;

  return (
    <article className={`event-card accent-${event.accent}`}>
      <div className="card-top">
        <span className="event-icon"><Icon name={event.icon} /></span>
        <span className="category-tag">{event.category}</span>
        {isFull && <span className="full-badge">FULL</span>}
      </div>
      <div className="card-content">
        <h3>{event.name}</h3>
        <p>{event.description}</p>
        <div className="event-details">
          <span><Icon name="calendar" /> <span>{event.date}<small>{event.time}</small></span></span>
          <span><Icon name="pin" /> <span>{event.venue}</span></span>
        </div>
      </div>
      <div className="capacity">
        <div>
          <span><Icon name="users" /> {isFull ? "No seats left" : `${seatsLeft} seats left`}</span>
          <small>{event.capacity} total</small>
        </div>
        <div className="capacity-bar"><span style={{ width: `${percentAvailable}%` }} /></div>
      </div>
      <button className="card-button" type="button" disabled={isFull} onClick={onRegister}>
        {isFull ? "Registration closed" : "Register now"} {!isFull && <Icon name="arrow" />}
      </button>
    </article>
  );
}

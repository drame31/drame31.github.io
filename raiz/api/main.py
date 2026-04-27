import secrets
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException, Path, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Raíz Restaurante API",
    description="Reservation and contact API for Raíz — Latin fusion restaurant, Barrio Escalante.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

ALLOWED_ORIGINS = [
    "https://drame31.github.io",
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def _generate_confirmation_code() -> str:
    return secrets.token_hex(4).upper()


@app.get("/api/health", tags=["System"])
def health_check():
    """Health check for Render.com and uptime monitors."""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat(), "version": "1.0.0"}


@app.post(
    "/api/reservations",
    response_model=schemas.ReservationResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Reservations"],
)
def create_reservation(payload: schemas.ReservationCreate, db: Session = Depends(get_db)):
    """
    Submit a table reservation request.
    Returns a confirmation code the guest can use to look up their booking.
    """
    code = _generate_confirmation_code()
    while db.query(models.Reservation).filter_by(confirmation_code=code).first():
        code = _generate_confirmation_code()

    reservation = models.Reservation(
        confirmation_code=code,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        date=payload.date,
        time=payload.time,
        party_size=payload.party_size,
        notes=payload.notes,
        status=models.ReservationStatus.confirmed,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return schemas.ReservationResponse(
        id=reservation.id,
        confirmation_code=reservation.confirmation_code,
        status=reservation.status,
        name=reservation.name,
        date=reservation.date,
        time=reservation.time,
        party_size=reservation.party_size,
        message=f"Reservación confirmada para {payload.party_size} persona(s) el {payload.date} a las {payload.time}. Tu código: {code}.",
    )


@app.get(
    "/api/reservations/{confirmation_code}",
    response_model=schemas.ReservationResponse,
    tags=["Reservations"],
)
def get_reservation(
    confirmation_code: str = Path(..., min_length=1, max_length=8),
    db: Session = Depends(get_db),
):
    """Look up a reservation by its confirmation code."""
    reservation = (
        db.query(models.Reservation)
        .filter_by(confirmation_code=confirmation_code.upper())
        .first()
    )
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró ninguna reservación con ese código.",
        )
    return schemas.ReservationResponse(
        id=reservation.id,
        confirmation_code=reservation.confirmation_code,
        status=reservation.status,
        name=reservation.name,
        date=reservation.date,
        time=reservation.time,
        party_size=reservation.party_size,
        message="Reservación encontrada.",
    )


@app.post(
    "/api/contact",
    response_model=schemas.ContactResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Contact"],
)
def submit_contact(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    """
    Submit a contact message.
    Stores the message in the database. In production, this would also
    trigger an email notification to the restaurant.
    """
    message = models.ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(message)
    db.commit()

    return schemas.ContactResponse(
        status="received",
        message="Mensaje recibido. Te contactaremos pronto.",
    )

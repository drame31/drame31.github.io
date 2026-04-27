from datetime import date, datetime
from pydantic import BaseModel, EmailStr, field_validator
from models import ReservationStatus

OPEN_DAYS = {1, 2, 3, 4, 5, 6}  # Tue–Sun (Mon = 0 is closed)
HOURS_BY_DAY = {
    1: ("12:00", "22:00"),  # Tuesday
    2: ("12:00", "22:00"),  # Wednesday
    3: ("12:00", "22:00"),  # Thursday
    4: ("12:00", "23:00"),  # Friday
    5: ("12:00", "23:00"),  # Saturday
    6: ("11:00", "16:00"),  # Sunday
}


class ReservationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    date: date
    time: str
    party_size: int
    notes: str | None = None

    @field_validator("date")
    @classmethod
    def date_must_be_future(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("La fecha de reservación debe ser en el futuro.")
        return v

    @field_validator("date")
    @classmethod
    def restaurant_must_be_open(cls, v: date) -> date:
        if v.weekday() not in OPEN_DAYS:
            raise ValueError("El restaurante no abre los lunes.")
        return v

    @field_validator("time")
    @classmethod
    def time_format(cls, v: str) -> str:
        try:
            h, m = v.split(":")
            hour, minute = int(h), int(m)
            if not (0 <= hour <= 23 and 0 <= minute <= 59):
                raise ValueError()
        except ValueError:
            raise ValueError("Formato de hora inválido. Use HH:MM (ej. 19:30).")
        return v

    @field_validator("party_size")
    @classmethod
    def party_size_range(cls, v: int) -> int:
        if not 1 <= v <= 20:
            raise ValueError("El tamaño del grupo debe estar entre 1 y 20 personas.")
        return v

    @field_validator("name")
    @classmethod
    def name_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres.")
        if len(v) > 100:
            raise ValueError("El nombre no puede superar los 100 caracteres.")
        return v


class ReservationResponse(BaseModel):
    id: int
    confirmation_code: str
    status: ReservationStatus
    name: str
    date: date
    time: str
    party_size: int
    message: str

    model_config = {"from_attributes": True}


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str | None = None
    message: str

    @field_validator("message")
    @classmethod
    def message_length(cls, v: str) -> str:
        if len(v.strip()) < 10:
            raise ValueError("El mensaje debe tener al menos 10 caracteres.")
        if len(v) > 1000:
            raise ValueError("El mensaje no puede superar los 1000 caracteres.")
        return v.strip()

    @field_validator("name")
    @classmethod
    def name_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres.")
        if len(v) > 100:
            raise ValueError("El nombre no puede superar los 100 caracteres.")
        return v

    @field_validator("subject")
    @classmethod
    def subject_length(cls, v: str | None) -> str | None:
        if v is not None and len(v) > 200:
            raise ValueError("El asunto no puede superar los 200 caracteres.")
        return v


class ContactResponse(BaseModel):
    status: str
    message: str

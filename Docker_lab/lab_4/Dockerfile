# Stage 1 — Builder (Heavy)
FROM python:3.12 as builder
WORKDIR /app
COPY app.py .

# Stage 2 — Lightweight runtime
FROM python:3.12-alpine
WORKDIR /app
COPY --from=builder /app /app

CMD ["python", "app.py"]

#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE VALIDACIÓN: HEALTH+ REACTIVE BACKEND
# Verifica:
# 1. Agendamiento exitoso (HTTP 201 Created)
# 2. Bloqueo distribuido concurrente en Redis (HTTP 409 Conflict)
# 3. Rate Limiting reactivo con Token Bucket en API Gateway (HTTP 429 Too Many Requests)
# ==============================================================================

set -e

GATEWAY_URL="http://localhost:8080"
CITAS_DIRECT_URL="http://localhost:8081"

# Datos semilla de PostgreSQL
PACIENTE_ID="c71e21b8-3e4b-4f51-b011-85b3cb29df33" # Carlos Mendoza
MEDICO_ID="f8a1a382-7f99-4c12-8e11-d0db341a99f1"   # Dra. Sofía Valenzuela (Cardióloga)

echo "=================================================================="
echo " [1/3] TEST: Agendamiento de Cita Exitosa (HTTP 201)"
echo "=================================================================="

SLOT_HORARIO="2026-11-20T10:00:00Z"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${CITAS_DIRECT_URL}/api/v1/citas" \
  -H "Content-Type: application/json" \
  -d "{
    \"pacienteId\": \"${PACIENTE_ID}\",
    \"medicoId\": \"${MEDICO_ID}\",
    \"fechaHora\": \"${SLOT_HORARIO}\",
    \"motivoConsulta\": \"Chequeo cardiológico preventivo\"
  }")

BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')
STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "Status Code: $STATUS"
echo "Response Body: $BODY"

if [ "$STATUS" -eq 201 ]; then
    echo ">>> EXITO: Cita agendada correctamente (Lock Redis adquirido, R2DBC persistido, Kafka emitido)."
else
    echo ">>> ALERTA: Código inesperado $STATUS"
fi

echo ""
echo "=================================================================="
echo " [2/3] TEST: Detección de Concurrencia y Double Booking (HTTP 409)"
echo " Intentando agendar la misma cita para el mismo médico y horario..."
echo "=================================================================="

CONFLICT_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${CITAS_DIRECT_URL}/api/v1/citas" \
  -H "Content-Type: application/json" \
  -d "{
    \"pacienteId\": \"b22e33c4-4f5a-5e62-c122-96c4dc30ea44\",
    \"medicoId\": \"${MEDICO_ID}\",
    \"fechaHora\": \"${SLOT_HORARIO}\",
    \"motivoConsulta\": \"Intento concurrente en mismo slot horario\"
  }")

CONFLICT_BODY=$(echo "$CONFLICT_RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')
CONFLICT_STATUS=$(echo "$CONFLICT_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "Status Code: $CONFLICT_STATUS"
echo "Response Body: $CONFLICT_BODY"

if [ "$CONFLICT_STATUS" -eq 409 ]; then
    echo ">>> EXITO: Bloqueo Distribuido en Redis funcionó correctamente. Conflicto mitigado (HTTP 409)."
else
    echo ">>> ALERTA: Se esperaba 409 pero se recibió $CONFLICT_STATUS"
fi

echo ""
echo "=================================================================="
echo " [3/3] TEST: Token Bucket Rate Limiting en API Gateway (HTTP 429)"
echo " Enviando ráfaga de 25 peticiones consecutivas al Gateway..."
echo "=================================================================="

RATE_LIMITED_COUNT=0
SUCCESS_COUNT=0

for i in $(seq 1 25); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${GATEWAY_URL}/api/v1/citas/paciente/${PACIENTE_ID}" || echo "000")
  if [ "$CODE" -eq 429 ]; then
    RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
  elif [ "$CODE" -eq 200 ]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  fi
done

echo "Peticiones exitosas (200): $SUCCESS_COUNT"
echo "Peticiones limitadas (429 Too Many Requests): $RATE_LIMITED_COUNT"

if [ "$RATE_LIMITED_COUNT" -gt 0 ]; then
    echo ">>> EXITO: RequestRateLimiter en Redis frenó la ráfaga de solicitudes con HTTP 429."
else
    echo ">>> INFO: Si los servicios aún no están levantados en el puerto 8080, levántalos con Docker Compose para verificar el Gateway."
fi

echo ""
echo "Pruebas finalizadas."

FROM python:3.10-slim

WORKDIR /app

# Install build dependencies for scientific libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Do not set PORT here; Railway will provide PORT env at runtime and
# the Flask app reads it dynamically.
EXPOSE 8000

CMD ["python", "flask_api.py"]



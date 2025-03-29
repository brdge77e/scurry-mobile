# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install system dependencies for ffmpeg and tesseract (and other libraries)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    tesseract-ocr \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# # Set environment variable for OpenAI API key
# ENV OPENAI_API_KEY="OPENAI_API_KEY"

# Expose port for FastAPI
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
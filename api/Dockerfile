# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies that might be needed by Python packages
# For example, Pillow needs libjpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY ./requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container at /app
COPY . /app

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the application
# This will start the Uvicorn server, making the API accessible.
# --host 0.0.0.0 is crucial to allow connections from outside the container.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

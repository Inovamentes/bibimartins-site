FROM openjdk:21-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
FROM maven:3.9.6-openjdk-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN --progress=plain mvn clean package -DskipTests -e

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/bibimartins-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


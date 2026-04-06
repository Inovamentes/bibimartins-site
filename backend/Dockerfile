RUN mvn clean package -DskipTests

FROM openjdk:21-jar-slim
WORKDIR /app
COPY --from

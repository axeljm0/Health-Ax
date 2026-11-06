FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY api-gateway/pom.xml ./api-gateway/
COPY citas-service/pom.xml ./citas-service/
RUN mvn dependency:go-offline -B -pl citas-service -am || true
COPY citas-service/src ./citas-service/src
RUN mvn clean package -DskipTests -pl citas-service -am

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/citas-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY api-gateway/pom.xml ./api-gateway/
COPY citas-service/pom.xml ./citas-service/
RUN mvn dependency:go-offline -B -pl api-gateway -am || true
COPY api-gateway/src ./api-gateway/src
RUN mvn clean package -DskipTests -pl api-gateway -am

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy all .csproj files to restore dependencies
COPY ["esecai.API/esecai.API.csproj", "esecai.API/"]
COPY ["esecai.Application/esecai.Application.csproj", "esecai.Application/"]
COPY ["esecai.Domain/esecai.Domain.csproj", "esecai.Domain/"]
COPY ["esecai.Infrastructure/esecai.Infrastructure.csproj", "esecai.Infrastructure/"]
COPY ["esecai.sln", "./"]

RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish "esecai.API/esecai.API.csproj" -c Release -o out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Cloudflare Tunnel will point to this port
EXPOSE 8080
ENTRYPOINT ["dotnet", "esecai.API.dll"]
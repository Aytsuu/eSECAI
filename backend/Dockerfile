# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy all .csproj files to restore dependencies
COPY ["eSECAI.API/eSECAI.API.csproj", "eSECAI.API/"]
COPY ["eSECAI.Application/eSECAI.Application.csproj", "eSECAI.Application/"]
COPY ["eSECAI.Domain/eSECAI.Domain.csproj", "eSECAI.Domain/"]
COPY ["eSECAI.Infrastructure/eSECAI.Infrastructure.csproj", "eSECAI.Infrastructure/"]
COPY ["eSECAI.sln", "./"]

RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish "eSECAI.API/eSECAI.API.csproj" -c Release -o out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Cloudflare Tunnel will point to this port
EXPOSE 8080
ENTRYPOINT ["dotnet", "eSECAI.API.dll"]
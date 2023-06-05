# Dockerfile para la aplicación de Node.js en versión 18.13.0
FROM node:18.13.0

# Copiar los archivos de la aplicación
COPY . /app

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar las dependencias
RUN npm install

# Comando para iniciar la aplicación
CMD ["npm", "start"]
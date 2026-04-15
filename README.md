# Task API
Proyecto solicitado por Wited a modo de prueba tecnica.
## Tecnologías utilizadas
| Servicio      | Versión   | Stack            |
|---------------|-----------|------------------|
| NodeJS        | v20       | Motor Javascript |
| NestJS        | v11.1.18  | Backend          |
| PostgreSQL    | v18.3     | Base de datos    |
| Redis         | v8.6.2    | Cache            |
| Docker        | v29.4.0   | Virtualización   |
## Como correr este proyecto
Este proyecto puede funcionar de manera independiente si ya tienes los servicios de PostgreSQL y Redis corriendo además de tener NodeJS instalado para compilar de Typescript a Javascript. Está tambien la posibilidad de correr este proyecto con Docker ya que se provee de un Dockefile y un docker-compose.yml con todos los servicios y variables de entorno listo para correr.

A continuación se describe los pasos para correr ambas instancias:

### Standalone
1. Clona este proyecto con ```git clone``` y entra a la carpeta backend/
2. Ejecuta ```npm i``` para instalar las dependencias de NodeJS.
3. Copia el archivo ```.env.example``` y renombralo a ```.env```. Luego edita el archivo ```.env``` y configura las variables de entorno.
4. Para correr en modo desarrollo ejecuta ```npm run start``` o ```npm run start:dev``` para el modo watch. 
5. Para correr en producción ejecuta ```npm run build``` y luego ```npm run start:prod```.

### Docker
1. Asegurate de que Docker y Docker Compose estén corriendo en tu entorno usando los comandos ```docker -v``` y ```docker compose version```.
2. Clona este proyecto con ```git clone```.
3. Para correr la instancia en modo desarrollo ejecuta ```docker compose -f docker-compose-dev.yml up```. Si necesitas sincronizar los cambios entre tu entorno y el contenedor corre la instancia con ```docker compose -f docker-compose-dev.yml watch```. Si tras detener el contenedor necesitas reconstruir el contenedor usa la opcion ```--build```.
4. Para correr en producción ejecuta ```docker compose -f docker-compose.yml up``` o ```docker compose up```

Nota: Si usas docker compose no es necesario que configures las variables de entorno ya que estan configuradas en el archivo yml.
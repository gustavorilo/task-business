#Proyecto Sooft (Challenge - "task business") 


Requerimiento solicitado para Challenge ( es el mismo que utilizamos para Back End)

Generar los siguientes 3 endpoints:

- Uno que traiga las empresas que hicieron transferencias el último mes

- Otro que traiga las empresas que se adhirieron el último mes.

- El último que haga la adhesión de una empresa.

Deseable: usar arquitectura hexagonal (o el servicio con el que te sientas más comodo)

Base: puede usarse relacional o no relacional

Datos de la empresa: CUIT, Razón Social, Fecha Adhesión

Datos de la transferencia: Importe, Id Empresa, Cuenta Débito, Cuenta Crédito

Instrucciones para instalar y ejecutar el proyecto en el entorno local.


Base de Datos NoSQL (Mongo)

Para leventar la base de datos, ejecutar lo siguiente:

DOCKER MONGODB (ejecutar próxima línea para correr mongo localmente)
`docker run --name mongo -d -p 27017:27017 mongo:latest`

Para correr el proyecto:
`npm start`
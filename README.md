# Now&Me Backend Task

## Tech

The backend was built on top of following tech-stack using TypeScript as preferred Language:

- NestJS (Framework)
- Express (Server)
- MySQL (Database)
- Redis (Database)
- Docker

### Routes

The API doc can be accessed at: http://localhost:3000/api

### ENV Variables

Project can be configured using different environment variables. These variables can be found in `.env.example` file.

### Demo

For the simplicity of demo, the project has been configured to used Docker as well.

Simply run the following command: `docker-compose up`

Once the containers are up and running, you may visit http://localhost:3000/api to access route information.

### Future enhancements

There were few things that had to be cut short due to time constraint. Some of them includes (but not limited to):

- Breaking the services into microservices.
- User Profile.
- Mobile number based authentication (OTP) / Email verification.

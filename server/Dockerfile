# Development stage
# Latest LTS Node.js release at the time of writting
FROM node:16.15.1-alpine As development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install rimraf because it is used in the prebuild script
RUN npm install glob rimraf

# Install only devDependencies due to the container being used as a “builder” that takes all the necessary tools to build the application
# and later send a clean /dist folder to the production image.
RUN npm install --only=development

COPY . .

# Build the /dist folder
RUN npm run build

# Production stage
FROM node:16.15.1-alpine as production

# Define the default value for NODE_ENV
ARG NODE_ENV=production

# Set NODE_ENV to either the default value or the user-set value.
ENV NODE_ENV=${NODE_ENV}

# Repeat the process from above
WORKDIR /usr/src/app

COPY package*.json ./

# Install only dependencies defined in dependencies in package.json
RUN npm install --only=production

COPY . .

# Copy the built /dist folder from the development image
COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start"]
FROM node:16.15.1-alpine AS builder

ENV NODE_ENV production
# Add a work directory

WORKDIR /usr/src/app

# Cache and Install dependencies
COPY package*.json ./
COPY yarn.lock .

RUN npm install --production
# Copy app files

COPY . .

# Production stage
FROM node:16.15.1-alpine as production

# Define the default value for NODE_ENV
ARG NODE_ENV=production

# Set NODE_ENV to either the default value or the user-set value.
ENV NODE_ENV=${NODE_ENV}

# Repeat the process from above
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock .

# Install only dependencies defined in dependencies in package.json
RUN npm install --only=production

COPY . .

# Copy the built /dist folder from the development image
COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start"]
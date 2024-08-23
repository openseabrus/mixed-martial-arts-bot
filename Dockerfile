FROM node:22-alpine

# Copy the built main.js file into the container
COPY dist/main.js .

# Define the command to run your application
CMD ["node", "main.js"]


# Step 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Build and rename index.csr.html to index.html
RUN npx ng build hopper --configuration=production --output-hashing=all --progress=false && \
    mv dist/hopper/browser/index.csr.html dist/hopper/browser/index.html

# Step 2: Serve with NGINX
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app
COPY --from=build /app/dist/hopper/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

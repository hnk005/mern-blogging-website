# Chọn Node 20.19.1
FROM node:20.19.1

# Tạo thư mục app
WORKDIR /app

# Copy package file trước
COPY package*.json ./

# Cài dependency
RUN npm install

# Copy source code
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]

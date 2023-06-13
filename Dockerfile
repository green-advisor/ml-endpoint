# Menggunakan image Node.js versi terbaru sebagai base image
FROM node:latest

# Mengatur direktori kerja di dalam container
WORKDIR /app

# install 
RUN apt-get update && apt-get install -y nano

# Menyalin package.json dan package-lock.json (jika ada) ke dalam container
COPY package*.json ./

# Menginstal dependensi yang diperlukan
RUN npm ci --only=production

# Menyalin kode aplikasi ke dalam container
COPY . .

# Menjalankan perintah untuk memulai aplikasi
CMD ["node", "app.js"]

# Menyatakan port yang akan di-EXPOSE
EXPOSE 3000



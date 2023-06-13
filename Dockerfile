# Menggunakan image Node.js versi 14 sebagai dasar
FROM node:14

# Set direktori kerja di dalam kontainer
WORKDIR /app

RUN apt-get update && apt-get install -y nano

# Menyalin package.json dan package-lock.json ke dalam kontainer
COPY package*.json ./

# Menjalankan perintah npm install untuk menginstal dependensi
RUN npm install

# Menyalin semua file sumber ke dalam kontainer
COPY . .

# Menentukan port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Menjalankan perintah untuk menjalankan aplikasi
CMD [ "node", "app.js" ]

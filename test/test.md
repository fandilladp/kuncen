1. should generate a valid token | 
   Test ini memeriksa apakah fungsi generateToken berhasil menghasilkan token yang valid.
   Hasil: Token yang dihasilkan berupa string dan memiliki panjang yang lebih dari 0. Ini menunjukkan bahwa token berhasil dihasilkan sesuai yang diharapkan.
2. should validate a valid token within expiry time | 
   Test ini memeriksa apakah token yang dihasilkan masih valid dalam batas waktu yang diberikan (expiry time).
   Hasil: Token yang dihasilkan berhasil divalidasi dan dianggap valid dalam waktu yang ditentukan. Ini menunjukkan fungsi validasi bekerja dengan baik untuk token yang belum kadaluarsa.
3. should not validate an expired token | 
   Test ini menguji apakah token yang kadaluarsa (expired) tidak dapat divalidasi.
   Hasil: Token yang expired tidak dianggap valid (test selesai dalam 3004ms). Ini memastikan bahwa token tidak dapat digunakan setelah waktu kadaluarsanya berakhir.
4. should not validate a token with incorrect key | 
   Test ini menguji apakah token tidak dapat divalidasi jika kunci (key) yang digunakan salah.
   Hasil: Token yang menggunakan kunci yang salah tidak dapat divalidasi. Ini menunjukkan bahwa validasi token dengan kunci salah ditangani dengan benar, dan token dianggap tidak valid.
5. should not validate a token with incorrect salt | 
   Test ini memeriksa apakah token tidak dapat divalidasi jika salt yang digunakan salah.
   Hasil: Token yang menggunakan salt yang salah tidak dapat divalidasi. Ini memastikan bahwa validasi token dengan salt yang salah ditangani dengan benar.

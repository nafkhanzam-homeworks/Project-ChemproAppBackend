# FRONTEND READ THIS!

Untuk Register
```
POST (/api/v1/register) 
BODY: {
		fullname, email, password
	  }
RESPONSE: OK Response (auth cookie will be set)
```

Untuk Login
```
POST (/api/v1/login) 
BODY: {
		email, password
	  }
RESPONSE: OK Response (auth cookie will be set)
```

Untuk Logout
```
POST (/api/v1/logout)
RESPONSE: OK Response (auth cookie will be set null)
```

PEMBAGIAN TUGAS BACKEND:
 - Struktur API Url (Jonet, Samuel, Hadi, Adit)
	 - Ngapain?
		 - Dari database, dibikinlah url untuk mengakses data di database tersebut. Contoh: `GET chempro.com/api/questions/17`, akan mendapatkan data object question dari database yang id-nya "17". Contoh lainnya, `POST chempro.com/api/questions DATA { question: "satu tambah satu berapa kak?" }` akan nambah object question ke dalam database.
	 - Referensi:
		 - https://restfulapi.net/resource-naming/
		 - https://www.restapitutorial.com/lessons/restfulresourcenaming.html
		 - https://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/
 - kodingan API: camcam
 - Skema database (yuni)
	 - Ngapain?
		 - Bikin struktur object database yang tiap object tersebut punya variabel2 yang berguna dan akan diakses oleh aplikasinya. Contoh: Objectnya User, punya variabel string nama, string NIM, string password. Contoh lainnya, objectnya Question, punya variabel string question, array of string answers, integer index jawaban terbaik di array answers, dll..
		 - Database list:
		 	- user
			- product
			- feedback
			- information
			- qna
	 - Referensi:
		 - https://mongoosejs.com/docs/guide.html
		 - [src/database/schemas](https://github.com/nafkhanzam/chempro_backend/tree/master/src/database/schemas)
 - Unit & Integrasi test
    - Ngapain?
        - Ngetes url2nya bisa menghasilkan hasil yg diinginkan atau ngga.
    - Referensi:
        - https://jestjs.io/docs/en/getting-started.html
        - http://zetcode.com/javascript/jest/

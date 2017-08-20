# Restful-API

This is a standard implementation of Restful API on a NoSQL Database of books.

Technology Stack
___________________________________________________________________________________________________________________________________
NodeJS,ExpressJS,MongoDB
Tools Used=GIT Bash,Rest Easy,Postman
Node Modules=Body Parser,jsonwebtoken,express-rate-limit.


API Calls Supported
___________________________________________________________________________________________________________________________________
"/":"Invalid Access	",
"/options":"To get the supported options  [OPTIONS]
"/token":"To generate a token for making API calls  [TOKEN]"
"/api/genres":"To get all Genres	[GET]",
"/api/books":"To get all Books	[GET]",
"/api/books":"To add Books	[POST]",
"/api/books/[limit]":"To limit the number of books returned	[GET]"
"/api/books/[book_id]":"To get a specific book	[GET]",
"/api/genres/[genre_id]":"To get a specific genre	[GET]",
"/api/genres":"To add genres to database	[POST]",
"/api/genres/[genre_id]":"To update a genre	[PUT]",
"/api/books/[book_id]":"To update a book	[PUT]",
"/api/genres/[genre_id]":"To delete a genre	[DELETE]",
"/api/books":"To get all the books	[GET]",
"/api/books/[book_id]":"To get a specific book	[GET]",
"/api/books/[book_id]":"To delete a book	[DELETE]",
"/api/books/patch/[book_id]":"To update a specific field [PATCH]",
"/api/books/patchOpcode/[book_id]":"To perform operations like add,replace,remove,test [PATCH]",
"/api/books/patchOpcode/[book_id1]/[[book_id2]":"To perform operations like copy,move [PATCH]"




Running on LoopBack IP address:
__________________________________________________________________________________________________________________________________

Example 1 : To generate a token
URL=http://localhost:3000/token
Response=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvb2tsaWJyYXJ5IiwiaWF0IjoxNTAzMjI1OTY4LCJleHAiOjE1MDMyMjk1Njh9.v6FxaVag_aXwiqV-YQD4PAaCIS4cReg8IOU7_Lp9nhs

Example 2 : To get a book with ID-5996b5c6289317a21d95dea4
URL=http://localhost:3000/api/books/5996b5c6289317a21d95dea4/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvb2tsaWJyYXJ5IiwiaWF0IjoxNTAzMjI1OTY4LCJleHAiOjE1MDMyMjk1Njh9.v6FxaVag_aXwiqV-YQD4PAaCIS4cReg8IOU7_Lp9nhs
Response=Book details of book with ID-6b5c6289317a21d95dea4

Example 3 : To add a comment to a book using PATCH opcode-add
URL=http://localhost:3000/api/books/patchOpcode/5996b5c6289317a21d95dea4/5996b5c6289317a21d95dea4/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvb2tsaWJyYXJ5IiwiaWF0IjoxNTAzMjI1OTY4LCJleHAiOjE1MDMyMjk1Njh9.v6FxaVag_aXwiqV-YQD4PAaCIS4cReg8IOU7_Lp9nhs
Body={"op":"add","value":"The Best Thriller I ever read",path:"comments"}
Response="The Best Thriller I ever read" is added to the comments of book with ID-5996b5c6289317a21d95dea4


Token Authorization :
____________________________________________________________________________________________________________________________________

1.  user needs to provide a valid token for making API calls. 
2.  Generated token LASTS for 1 Hour after whcih user cannot use the same.He needs to generate a new token

API Call Limiting :
____________________________________________________________________________________________________________________________________
1.The Calls are limited to 5 per minute after which user needs to wait for a minute.
2.The following response is sent once the limit is exceeded:
"Sorry, the maximum limit of 5 API calls per minute has been reached. Please try after some time!"
3. Headers provide both the pieces of information :

x-ratelimit-remaining,x-ratelimit-limit

*************************************************
date: Sun, 20 Aug 2017 10:59:08 GMT             *
x-powered-by: Express                           *
etag: W/"ad1-eCsmy5tOjoCv7ugSFbgv8WIMiuE"       *
x-ratelimit-remaining: 4                        *
content-type: application/json; charset=utf-8   *
x-ratelimit-limit: 5                            *
connection: keep-alive                          *
content-length: 2769                            *
*************************************************



SQL Injections :
____________________________________________________________________________________________________________________________________
SQL Injections are taken care of while parsing the user supplies params to API calls.




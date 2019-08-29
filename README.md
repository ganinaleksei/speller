npm install
npm test
npm run start

api:

  registrate:
  
    curl --header "Content-Type: application/json" --request POST --data '{"login":"login","password":"password"}' http://localhost:8080/auth/registrate
  
  auth:
  
    curl --header "Content-Type: application/json" --request POST --data '{"login":"login","password":"password"}' http://localhost:8080/auth/login
    
  check text:
  
    curl --header "Content-Type: application/json" --header "session_id: YOUR_SESSION_ID" --request POST --data '{"text":"Крснаю шакочка"}' http://localhost:8080/check
    
  or check text of file
  
    curl --header "Content-Type: multipart/form-data" --header "session_id: YOUR_SESSION_ID" --request POST -F "text=@./test/test_text.txt" http://localhost:8080/check

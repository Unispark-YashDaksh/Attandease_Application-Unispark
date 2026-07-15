import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 5000 },
    { duration: '50s', target: 50000 },
    { duration: '10s', target: 25000 },
    { duration: '2m', target: 10000 }
  ],
};

// Ek dummy small file memory mein generate karne ke liye (Multer validation pass karne ke liye)
const dummyBinFile = http.file("fake-selfie-bytes-data", "selfie.jpg", "image/jpeg");

export default function () {
  const BASE_URL = 'http://host.docker.internal:7000'; //

  const uniqueId= `UNI${Math.floor(Math.random()* 1000)+1000}`;
  const randomName= `Test Emp${Math.floor(Math.random()*1000)+1000}`;
  const randomEmailId= `testemployee${Math.floor(Math.random()*100)+100}@gmail.com`

  const payload= JSON.stringify({
    id: uniqueId,
    employee_code: uniqueId,
    employee_name: randomName,
    department_id: 1,
    designation_id:1,
    shift_id:1,
    employee_email_id:randomEmailId,
    branch_id: 1,
    role_id: 1
  });

  const params={
    headers:{
        'Content-Type': 'application/json'
    }
  }

  const res= http.post(`${BASE_URL}/addNewEmployee`, payload, params);

  check(res, {
    'employee created successfully': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.05);

//   // --- 1. PUNCH IN (Multipart/Form-Data with Multer compatibility) ---
//   const punchInData = {
//     employee_id: 'EMP_YASH_01',
//     latitude: '27.4924',
//     longitude: '77.6737',
//     readable_address: 'Mathura, Uttar Pradesh',
//     attendance_mode: 'office',
//     office_location_id: 'OFF_001',
//     selfie: dummyBinFile, // Yeh Multer upload.single("selfie") ko pass karega
//   };

//   const resPunchIn = http.post(`${BASE_URL}/punch-in`, punchInData); // Note: No manual JSON headers needed here, k6 automatic multipart boundaries set karega
//   check(resPunchIn, { 'punch-in status 200': (r) => r.status === 200 });

//   sleep(0.5);

//   // --- 2. ATTENDANCE FETCH (GET Request) ---
//   const resAttendance = http.get(`${BASE_URL}/attendance?employee_id=EMP_YASH_01`);
//   check(resAttendance, { 'attendance status 200': (r) => r.status === 200 });

//   sleep(0.5);

//   // --- 3. FETCH EMPLOYEES (GET Request) ---
//   const resEmployees = http.get(`${BASE_URL}/fetch-employees`);
//   check(resEmployees, { 'fetch-employees status 200': (r) => r.status === 200 });

//   sleep(0.5);

//   // --- 4. PUNCH OUT (Agar isme bhi same fields hain toh badal lena) ---
//   const punchOutData = {
//     employee_id: 'EMP_YASH_01',
//     latitude: '27.4924',
//     longitude: '77.6737',
//     readable_address: 'Mathura, Uttar Pradesh',
//     attendance_mode: 'office',
//     office_location_id: 'OFF_001',
//   };
//   const resPunchOut = http.post(`${BASE_URL}/punch-out`, punchOutData);
//   check(resPunchOut, { 'punch-out status 200': (r) => r.status === 200 });

}
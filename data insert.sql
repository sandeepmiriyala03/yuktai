INSERT INTO employees (name, salary, age, departmentid)
SELECT
    (ARRAY['Sandeep','Ravi','Priya','Kiran','Anitha','Mahesh','Teja','Lakshmi','Vijay','Suresh',
           'Deepika','Arjun','Sneha','Rahul','Naveen','Pooja','Harsha','Keerthi','Ramesh','Divya',
           'Ajay','Bhavana','Chandra','Madhavi','Sai','Nikhil','Akhila','Vamsi','Gayathri','Praveen',
           'Swathi','Abhishek','Sanjana','Tarun','Manasa','Karthik','Shalini','Yash','Neha','Rohit',
           'Pavani','Ashok','Sravani','Mohan','Jyothi','Ganesh','Meghana','Vinay','Kavya','Rajesh',
           'Anil','Sunitha','Vikram','Pallavi','Srinivas','Aishwarya','Manoj','Radhika','Sunil','Kavitha'])[floor(random() * 60 + 1)::int]
    || ' ' ||
    (ARRAY['Kumar','Reddy','Sharma','Rao','Babu','Devi','Krishna','Nair','Varma','Gupta',
           'Jain','Singh','Vardhan','Naidu','Patel','Sekhar','Verma','Iyer','Pillai','Menon'])[floor(random() * 20 + 1)::int]
    || ' ' || i::text AS name,
    (45000 + floor(random() * 105000))::numeric(10,2) AS salary,
    (22 + floor(random() * 37))::int AS age,
    (1 + floor(random() * 50))::int AS departmentid
FROM generate_series(1, 1000000) AS i;
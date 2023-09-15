import {React, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function RegisterationPage() {
    const [email, setemail] = useState ('');
    const [password, setpassword]  =useState ('');
    const[firstname,setfirstname]  =useState('');
    const[lastname,setlastname]  =useState('');
    const[DOB,setDOB]  =useState('');

    const navigate = useNavigate();


    const handlesubmit = (e) => {
        e.preventdefault();
        console.log(email);
    
        }
        const handleClick = () =>{
            <NavLink to={"/signin"}></NavLink>
        }

return (
<div className="bg">
<h2>Register </h2>
<form className="Register-form" onSubmit = {handlesubmit}>
        <label htmlFor="firstname"> firstname</label>
        <input value = {firstname}  onChange={(e) => setfirstname(e.target.value)} firstname = "firstname" id ="firstname" placeholder="firstname"/>

        <label htmlFor="lastname"> lastname</label>
        <input value = {lastname}  onChange={(e) => setlastname(e.target.value)} lastname = "lastname" id ="lastname" placeholder="lastname"/>

        <label htmlFor="DOB"> DOB</label>
        <input value = {DOB}  onChange={(e) => setDOB(e.target.value)} DOB = "DOB" id ="DOB" placeholder="DOB"/>

        <label htmlfor = "email" > email </label>
        <input value = {email}  onChange={(e) => setemail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>

        <label htmlfor = "password" > password </label>
        <input value = {password}  onChange={(e) => setpassword(e.target.value)} type="password" placeholder="*********" id="password" name="password"/>
        <button type = "submit"> Register</button>

        
    </form>
    <button onClick={handleClick }>already have an Account? login here</button>

    </div>
)
}

export default RegisterationPage
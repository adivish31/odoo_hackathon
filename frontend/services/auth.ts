const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


export async function login(
  email: string,
  password: string
) {

  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );


  const data = await response.json();


  if(!response.ok){
    throw new Error(data.message || "Login failed");
  }


  return data;
}



export async function register(
  name: string,
  email: string,
  password: string,
  role: string
) {

  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }
  );


  const data = await response.json();


  if(!response.ok){
    throw new Error(data.message || "Registration failed");
  }


  return data;
}
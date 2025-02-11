

export  const getProducts = async () => {

    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`,
        {method:"GET",
        headers:{
            "Content-Type":"application/json",
        }
    }
    );
    const data = await response.json();
    return data;
}
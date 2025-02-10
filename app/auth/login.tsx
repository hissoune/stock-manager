import React, { useState } from 'react';
import { StyleSheet } from 'react-native';


const LoginPage: React.FC = () => {
    const [secretKey, setSecretKey] = useState('');
     

     
    const handelLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Secret Key:', secretKey);
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handelLogin}>
                <h1 style={styles.title}>Login</h1>
                <input
                    type="password"
                    style={styles.input}
                    placeholder="Enter Secret Key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
                <button type="submit" style={styles.button} >Login</button>
            </form>
        </div>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    form:{
        width: '100%',
        maxWidth: 400,
        padding: 20,
       
        borderRadius: 5,
    },
    title:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input:{
        width: '100%',
        padding: 10,
        marginBottom: 10,
    },
    button:{
        width: '100%',
        padding: 10,
        backgroundColor: 'black',
        color: 'white',
      
        borderRadius: 5,
    },


});

export default LoginPage;

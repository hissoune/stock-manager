import type React from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { loginAction } from "@/app/(redux)/authSlice"
import { router } from "expo-router"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/app/(redux)/store"

const validationSchema = Yup.object().shape({
  secretKey: Yup.string()
  .matches(/^[A-Za-z]{2}\d{5}[A-Za-z]{1}$/, "Secret key must start with 2 letters, followed by 6 numbers, and end with 1 letter")
  .required("Secret key is required"),
})

const LoginPage: React.FC = () => {

    const dispatch =useAppDispatch();

  



    
    const handleLogin = async (values: { secretKey: string }) => {
        try {
            dispatch(loginAction(values.secretKey));
            router.push("/(tabs)");
        } catch (error) {
          console.error("Login error:", error);
        }
      };
      

  return (
    <View style={styles.container}>
      <Formik initialValues={{ secretKey: "" }} validationSchema={validationSchema} onSubmit={handleLogin}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.label}>Enter your secret key to login</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Secret Key"
              secureTextEntry
              value={values.secretKey}
              onChangeText={handleChange("secretKey")}
              onBlur={handleBlur("secretKey")}
            />
            {touched.secretKey && errors.secretKey && <Text style={styles.errorText}>{errors.secretKey}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },

  form: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color:"#FF9900"
  },
  label:
    {
       textAlign: "center",
        marginBottom: 10,
    },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "#FF9900",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
})

export default LoginPage


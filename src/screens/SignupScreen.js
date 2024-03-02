import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Alert } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const SignupScreen = () => {

  const navigation = useNavigation();

  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("")
  const [name, setName] = useState('')


  const handleSignup = async () => {
    try {
      if (inputEmail.length > 0 && password.length > 0 && name.length>0) {

       const response= await auth().createUserWithEmailAndPassword(inputEmail, password)   
         console.log(response)


        
      const userData={
        id:response.user.uid,
        name:name,
        email:inputEmail,
      }
      await firestore().collection('users').doc(response.user.uid).set(userData)



         await auth().currentUser.sendEmailVerification()
         .then(()=>{
          console.log("hello");
          Alert.alert("Check the Verification Link")
           auth().signOut()

          navigation.navigate('Login')
         })

      }
      else {
        Alert.alert("Please Enter the data")
      }

    }
    catch (error) {
      console.log(error);
      setMessage(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View>

        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 35, color: 'black' }}>MetaHub</Text>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          style={styles.inputbox}
          placeholder="Enter Email"
          value={inputEmail}
          onChangeText={(text) => setInputEmail(text)}
        />
        <TextInput
          style={styles.inputbox}
          placeholder="Enter Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />


        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleSignup()}
        >
          <Text style={{ fontSize: 20, color: 'white' }}>SignUp</Text>
        </TouchableOpacity>
        <Text style={{ color: 'red' }}>{message}</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login')
          }}
          style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '500' }}>Already have an account? <Text style={{ color: 'blue', fontSize: 20 }}>Login</Text></Text>
        </TouchableOpacity>

      </View>


    </View>
  )
}
const { width, height } = Dimensions.get('screen')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputbox: {
    width: width - 30,
    borderRadius: 15,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    borderWidth: 2
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 15,
    margin: 8,
    padding: 6,

  },
  cardContainer: {
    marginVertical: 20
  },
  card: {
    backgroundColor: '#fff',
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10
  }
})

export default SignupScreen;
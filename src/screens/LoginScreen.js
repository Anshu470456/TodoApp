import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Alert } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import { StackActions, useNavigation } from '@react-navigation/native';




const LoginScreen = () => {

    const navigation = useNavigation();

    const [inputEmail, setInputEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("")



    const handleLogin = async () => {

        try {

            if (inputEmail.length > 0 && password.length > 0) {

                const userSignIn = await auth().signInWithEmailAndPassword(inputEmail, password)
                console.log(userSignIn)

                if (userSignIn.user.emailVerified) {

                    Alert.alert("Email Verified");
                    navigation.dispatch(StackActions.replace('Home'));


                }
                else {
                    Alert.alert("Email not Verified");
                    await auth().currentUser.sendEmailVerification();
                    await auth().signOut()
                }

                //  setMessage('')

                //  navigation.navigate('Home',{
                //     email: userSignIn.user.email,
                //     uid: userSignIn.user.uid,
                //  })

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

                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 35, color: 'black' }}>Login</Text>
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
                    onPress={() => handleLogin()}
                >
                    <Text style={{ fontSize: 20, color: 'white' }}>Login</Text>
                </TouchableOpacity>
                <Text style={{ color: 'red', paddingLeft: 20 }}>{message}</Text>

                <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500' }}>Don't have an account?</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Signup')
                    }}
                    style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'blue', fontSize: 20 }}>Create account</Text>
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

export default LoginScreen;
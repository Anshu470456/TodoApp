import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import auth from '@react-native-firebase/auth';

const MobileVerificationScreen = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [comfirmData, setComfirmData] = useState('');

  const sendOtp = async () => {
    try {
      const mobile = '+91' + mobileNo;
      const response = await auth().signInWithPhoneNumber(mobile);
      console.log(response);
      setComfirmData(response);
      Alert.alert('Otp is sent on your mobile device');
    } catch (error) {
      console.log(error);
    }
  };

  const submitOtp = async () => {
    try {
      const response = await comfirmData.confirm(otpInput);
      console.log(response);
      Alert.alert('Your Otp is verified');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
        Mobile Verification
      </Text>
      <TextInput
        placeholder="Enter Mobile No. "
        style={styles.inputText}
        value={mobileNo}
        onChangeText={text => setMobileNo(text)}
      />
      <Button title="Send Otp" onPress={() => sendOtp()} />

      <TextInput
        placeholder="Enter Otp "
        style={styles.inputText}
        value={otpInput}
        onChangeText={text => setOtpInput(text)}
      />
      <Button title="Submit" onPress={() => submitOtp()} />
    </View>
  );
};

export default MobileVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    borderWidth: 2,
    width: '80%',
    borderRadius: 15,
    borderColor: 'blue',
    padding: 10,
    marginBottom: 5,
    marginTop: 15,
  },
});

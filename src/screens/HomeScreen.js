import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
// import { useRoute } from '@react-navigation/native'
import auth from '@react-native-firebase/auth';
import { StackActions, useNavigation } from '@react-navigation/native';



const HomeScreen = () => {
   const navigation=useNavigation();



  // const route=useRoute();
  // const {email,uid} =route.params;
  return (
    <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
      <Text>Email: {auth().currentUser.email}</Text>
      <Text>uid: {auth().currentUser.uid}</Text>

      <TouchableOpacity 
      onPress={async ()=>{
       await auth().signOut()
        // navigation.navigate('Login')
        navigation.dispatch(StackActions.replace('Login'));
      }}
      style={styles.button} 
      >
        <Text style={{alignSelf:'center',color:'white',fontSize:20}} >Logout</Text>
      </TouchableOpacity>
      
      
    </View>
  )
}
const styles=StyleSheet.create({
  button:{
  width:'60%',
  backgroundColor:'red',
  borderRadius:20,
  padding:10,

    
  }

})

export default HomeScreen
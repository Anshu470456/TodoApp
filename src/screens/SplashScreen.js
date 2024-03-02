import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { StackActions, useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      const unsubscribe = await auth().onAuthStateChanged(user => {
        const routeName = user !== null ? 'Home' : 'Login';

        // unsubscribe();
        navigation.dispatch(StackActions.replace(routeName));
      });
    }, 1);
    return () => { };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'blue', fontSize: 35, fontWeight: '900' }}>Todo App</Text>
    </View>
  );
};

export default SplashScreen;

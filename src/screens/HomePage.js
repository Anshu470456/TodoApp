import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  ScrollView,
  useColorScheme
} from 'react-native';
import React, { useEffect, useState } from 'react';
// import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const HomePage = () => {
  const [inputTextValue, setInputTextValue] = useState(null);
  const [list, setList] = useState(null);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      const data = await database()
        .ref('todo')
        .on('value', tempData => {
          console.log(data);
          setList(tempData.val());
        });
    } catch (error) {
      console.log('Error is : ', error);
    }
  };
  const handleAddData = async () => {
    try {
      const index = list.length;

      const response = await database()
        .ref(`todo/${index}`)
        .set({
          value: inputTextValue,
        })
        .then(() => console.log('Data set.'));
      console.log(response);
      setInputTextValue('');
    } catch (e) {
      console.log('Error1: ', e);
    }
  };

  const handleUpdateData = async () => {
    try {
      if (inputTextValue.length > 0) {
        const response = await database()
          .ref(`todo/${selectedCardIndex}`)
          .update({
            value: inputTextValue,
          });
        console.log(response);
        setInputTextValue('');
        setIsUpdateData(false);
      } else {
        Alert.alert('Please enter some value');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardPress = (cardIndex, cardValue) => {
    try {
      setIsUpdateData(true);
      setSelectedCardIndex(cardIndex);
      setInputTextValue(cardValue);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLongCardPress = (cardIndex, cardValue) => {
    try {
      Alert.alert('Alert', `Are you sure want to delete ${cardValue}? `, [
        {
          text: 'Ok',
          onPress: async () => {
            try {
              const response = await database()
                .ref(`todo/${cardIndex}`)
                .remove();
              setInputTextValue('');
              setIsUpdateData(false);
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('cancel press'),
        },
      ]);
      // setIsUpdateData(true)
      // setSelectedCardIndex(cardIndex)
      // setInputTextValue(cardValue)
    } catch (error) {
      console.log(error);
    }
  };

  const theme = useColorScheme();
  const isDarkTheme = darkMode;

  return (

    <View style={[styles.container,
    isDarkTheme
      ? { backgroundColor: '#383838' }
      : { backgroundColor: 'lightgrey' },]}>


      <StatusBar hidden={true} />
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 12 }}>
          <Text
            style={[{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 35,
              color: 'black',
            }, isDarkTheme
              ? { color: 'white' }
              : { color: 'black' }]}>
            Todo App
          </Text>
          <TouchableOpacity style={styles.mode} onPress={() => { setDarkMode(!darkMode) }}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Mode</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.inputbox, isDarkTheme
            ? { color: 'white', borderColor: 'white', backgroundColor: 'grey', borderWidth: 2 }
            : { color: 'black', backgroundColor: 'white' }]}
          placeholder="Enter any Value..."
          value={inputTextValue}
          onChangeText={text => setInputTextValue(text)}
        />

        {!isUpdateData ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddData()}>
            <Text style={{ fontSize: 20, color: 'white' }}>Add</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleUpdateData()}>
            <Text style={{ fontSize: 20, color: 'white' }}>Update</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.cardContainer]}>
          <Text style={[{ color: 'black', fontWeight: 'bold', fontSize: 25 }, isDarkTheme
            ? { color: 'white' }
            : { color: 'black' }]}>
            Todo List :
          </Text>
          <FlatList
            data={list}
            renderItem={item => {
              // console.log(item)
              const cardIndex = item.index;

              if (item.item !== null) {
                return (
                  <TouchableOpacity
                    onPress={() => handleCardPress(cardIndex, item.item.value)}
                    onLongPress={() =>
                      handleLongCardPress(cardIndex, item.item.value)
                    }
                    style={[styles.card, isDarkTheme ? { backgroundColor: 'lightgrey' } : { backgroundColor: 'white' }]}>
                    <Text style={styles.cardText}>{item.item.value}</Text>
                  </TouchableOpacity>
                );
              }
            }}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={async () => {
          await auth().signOut();

          navigation.dispatch(StackActions.replace('Login'));
        }}
        style={styles.button}>
        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 20 }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>

  );
};
const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputbox: {
    width: width - 30,
    borderRadius: 15,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    borderWidth: 2,
    fontSize: 15
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 15,
    margin: 8,
    padding: 6,
    elevation: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: 'yellow',
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,
    elevation: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.1,
    shadowRadius: 1,

  },
  button: {
    width: '60%',
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: 'yellow',
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'left',
    color: 'black',
  },
  mode: {
    backgroundColor: 'yellow',
    borderRadius: 30,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'orange',
    borderWidth: 2
  }
});

export default HomePage;

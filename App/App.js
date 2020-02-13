import { AppRegistry, StyleSheet, Text, View, Platform , ActivityIndicator , TextInput , ScrollView , TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import React, { Component } from 'react';

//44c188ad06e81037a011c9486c76fc79
// key stiri e6f42ce2e83945aba580646d8014590a



export default class App extends React.Component {

  render() {
    return (
        <AppContainer />
    );
  }
}

class HomeScreen extends React.Component {
  render() {
    return(
      <View style={styles.main}>

      </View>
    );
  }
}

class MoneyScreen extends React.Component {
  render() {
    return(
      <View style={styles.main}>

      </View>
    );
  }
}

class NewsScreen extends React.Component {
  state = {
    data:null,
  };
  componentDidMount(){
    fetch('https://newsapi.org/v2/top-headlines?country=ro&apiKey=e6f42ce2e83945aba580646d8014590a')
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          //console.log(myJson);
          let data = JSON.stringify(myJson);
          this.setState({ data });
        });
    }

  render() {
    let stiri = this.state.data;
    return(
      <View style={styles.main}>
        <Text> {stiri} </Text>
      </View>

    );
  }
}

class WeatherScreen extends React.Component {
  state = {
    errorMessage: null,
    temp:null,
    temp_max:null,
    temp_min:null,
    mainStatus:null,
    description:null,
    weatherStatus: null,
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  
  
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=44c188ad06e81037a011c9486c76fc79')
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        //console.log(myJson.weather[0].main);
        
        //console.log(myJson.main.temp);
        let temp = myJson.main.temp;
        let temp_max = myJson.main.temp_max;
        let temp_min = myJson.main.temp_min;
        let mainStatus = myJson.weather[0].main;
        let description = myJson.weather[0].description;
        this.setState({temp, temp_max, temp_min, mainStatus, description})
        
      })



      .catch((error) => {
        console.error(error);
      });
  };
  
  render() {

    let vreme = this.state.weatherStatus;
    let temp = this.state.temp;
    let temp_max = this.state.temp_max;
    let temp_min = this.state.temp_min;
    let mainStatus = this.state.mainStatus;
    let description = this.state.description;
    return(
      <View style={styles.main}>
        <Text> {vreme} </Text>
        <Text>{temp}</Text>
        <Text>{temp_min}</Text>
        <Text>{temp_max}</Text>
        <Text>{description}</Text>
        <Text>{mainStatus}</Text>
      </View>
    );
  }
}

class AgendaScreen extends React.Component {
  render() {
    return(
      <View>
        
      </View>
    );
  }
}

const bottomTabNavigator = createBottomTabNavigator(
  {
    Money: {
      screen: MoneyScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'money-bill-wave'} size = {22.5} color = {tintColor} />
        )
      }
    },
    News: {
      screen: NewsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'newspaper'} size = {22.5} color = {tintColor} />
        )
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'home'} size = {22.5} color = {tintColor} />
        )
      }
    },
    Notes: {
      screen: AgendaScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'list-alt'} size = {22.5} color = {tintColor} />
        )
      }
    },
    Weather: {
      screen: WeatherScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'cloud-sun'} size = {22.5} color = {tintColor} />
        )
      }
    },
  },
  {
    lazy: false,
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#f1fcfc',
      activeBackgroundColor: '#a4d7e1',
      inactiveBackgroundColor: '#daf1f9',
      inactiveTintColor: '#142850',
      adaptive: true
    }
  }
);

const styles = StyleSheet.create({
  main:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:'#fff',
  }
});

const AppContainer = createAppContainer(bottomTabNavigator);